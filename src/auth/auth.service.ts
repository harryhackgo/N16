import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { AdminsService } from '../admins/admins.service';
import { JwtService } from '@nestjs/jwt';
import { SessionsService } from './sessions.service';
import { Request } from 'express';
import { SignupUserDto } from './dto/signup-user.dto';
import { EskizService } from '../eskiz/eskiz.service';
import { PrismaService } from '../prisma.service';
import { UserActivationDto } from './dto/user-activation.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { CreateAdminDto } from '../admins/dto/create-admin.dto';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Admin, User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private adminService: AdminsService,
    private jwtService: JwtService,
    private sessionsService: SessionsService,
    private eskizService: EskizService,
    private prisma: PrismaService,
  ) {}

  getRoles(user) {
    let roles: Array<String> = [];
    if (user.is_super_admin) {
      roles.push('superadmin');
    }
    if (user.is_viewer_admin) {
      roles.push('vieweradmin');
    }
    if ('hasCompany' in user) {
      roles.push('user');
    }
    if (roles.length === 0) {
      roles.push('admin');
    }
    return roles;
  }

  async getTokens(user) {
    const roles = this.getRoles(user);

    const payload = {
      id: user.id,
      email: user.email,
      roles: roles,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async signUpUser(signupUserDto: SignupUserDto) {
    try {
      const existingUser = await this.userService.findOneByEmail(
        signupUserDto.email,
      );
      if (existingUser) {
        throw new NotFoundException('Email already exists');
      }
      const hashedPassword = await bcrypt.hash(signupUserDto.password, 7);
      const { otp } = await this.eskizService.generateOtp(signupUserDto.phone);

      const newUser = await this.prisma.user.create({
        data: {
          ...signupUserDto,
          password: hashedPassword,
          otp: otp.toString(),
          otpExpires: new Date(Date.now() + 5 * 60 * 1000),
        },
      });

      return {
        message: `User created successfully! Don\'t forget to activate your account through http://localhost:${process.env.PORT}/api/auth/activate within 5 minutes`,
        otp: newUser.otp,
      };
    } catch (error) {
      throw new NotFoundException('Error signing up user: ' + error.message);
    }
  }

  async activateUser(dto: UserActivationDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          phone: dto.phone,
          otp: dto.otp,
          otpExpires: { gt: new Date() },
        },
      });

      if (!user) {
        throw new NotFoundException('Invalid OTP or account already activated');
      }
      if (user.isActive) {
        throw new NotFoundException('Account already activated');
      }
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          isActive: true,
          otp: null,
          otpExpires: null,
        },
      });
      return {
        message: 'User account activated successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Invalid OTP or account already activated');
      }
      throw new NotFoundException('Error activating user: ' + error.message);
    }
  }

  async resendOtp(resendOtp: ResendOtpDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { phone: resendOtp.phone },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      if (user.isActive) {
        throw new NotFoundException('Account already activated');
      }
      const { otp } = await this.eskizService.generateOtp(resendOtp.phone);
      await this.prisma.user.update({
        where: { phone: resendOtp.phone },
        data: {
          otp: otp.toString(),
          otpExpires: new Date(Date.now() + 5 * 60 * 1000),
        },
      });
      return {
        message: `OTP resent successfully! Don't forget to activate your account through http://localhost:${process.env.PORT}/api/auth/activate within 5 minutes`,
        otp,
      };
    } catch (error) {
      throw new NotFoundException('Error resending OTP: ' + error.message);
    }
  }

  async signInUser(createAuthDto: CreateAuthDto, req: Request) {
    try {
      const { email, password } = createAuthDto;
      const user = await this.userService.findOneByEmail(email);

      if (!user) {
        throw new NotFoundException('Email or password is wrong');
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new NotFoundException('Email or password is wrong');
      }
      if (!user.isActive) {
        throw new NotFoundException('Account is not activated');
      }
      const { access_token, refresh_token } = await this.getTokens(user);
      await this.sessionsService.createSession(req, user.id, refresh_token);

      return { access_token, refresh_token };
    } catch (error) {
      throw new NotFoundException('Error signing in user: ' + error.message);
    }
  }

  async signOutUser(userId: string) {
    return this.sessionsService.deleteAllSessions(userId);
  }

  async signInAdmin(email: string, password: string, req: Request) {
    const admin = await this.adminService.findOneByEmail(email);

    if (!admin) {
      throw new NotFoundException('Email or password is wrong');
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new NotFoundException('Email or password is wrong');
    }
    const { access_token, refresh_token } = await this.getTokens(admin);
    await this.sessionsService.createSession(req, admin.id, refresh_token);
    return { access_token, refresh_token };
  }

  async refreshTokens(
    refreshToken: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const decoded = await this.jwtService.verifyAsync(refreshToken, {
      secret: process.env.REFRESH_TOKEN_KEY,
    });
    if (!decoded) {
      throw new NotFoundException('Invalid refresh token');
    }
    const userId = decoded.id;
    const session = await this.sessionsService.getSessionsByUserId(userId);
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    for (const s of session) {
      const match = await bcrypt.compare(refreshToken, s.refreshToken || '');
      if (match) {
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
        });
        if (!user) {
          throw new NotFoundException('User not found');
        }
        const { access_token, refresh_token } = await this.getTokens(user);
        await this.sessionsService.updateSession(s.id, refresh_token);
        return { access_token, refresh_token };
      }
    }
    throw new NotFoundException('Invalid refresh token');
  }
}
