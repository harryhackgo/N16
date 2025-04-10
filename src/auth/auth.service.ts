import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { AdminsService } from '../admins/admins.service';
import { JwtService } from '@nestjs/jwt';
import { SessionsService } from './sessions.service';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private adminService: AdminsService,
    private jwtService: JwtService,
    private sessionsService: SessionsService
  ) {}

  async signInUser(email: string, password: string, req: Request) {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException('Email or password is wrong');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new NotFoundException('Email or password is wrong');
    }

    this.sessionsService.createSession(req, user.id)

    const payload = { sub: user.id, email: user.email, roles: ['user']};
    const token = this.jwtService.sign(payload);
    return { token };
  }

  async signOutUser(userId: number) {
    return this.sessionsService.deleteAllSessions(userId)
  }

  async signInAdmin(email: string, password: string) {
    const admin = await this.adminService.findOneByEmail(email);

    if (!admin) {
      throw new NotFoundException('Email or password is wrong');
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new NotFoundException('Email or password is wrong');
    }
    const roles = ['admin'];
    if (admin.isSuperAdmin) roles.push('superadmin')
    const payload = { sub: admin.id, email: admin.email, roles};
    const token = this.jwtService.sign(payload);
    return { token };
  }
}
