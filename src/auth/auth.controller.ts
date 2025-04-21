import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Public } from '../decorators/public.decorator';
import { Request } from 'express';
import { SessionsService } from './sessions.service';
import { AuthGuard } from '../guards/auth.guard';
import { Role } from '../enums/role.enum';
import { RolesGuard } from '../guards/roles.guard';
import { SelfGuard } from '../guards/self.guard';
import { Roles } from '../decorators/roles.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SignupUserDto } from './dto/signup-user.dto';
import { UserActivationDto } from './dto/user-activation.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { GetUser } from '../decorators/get-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private sessionsService: SessionsService,
  ) {}

  @Public()
  @Post('signup')
  @ApiOperation({ summary: 'Sign up as a regular user' })
  @ApiResponse({ status: 201, description: 'User siged up successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  signUpUser(@Body() signupUserDto: SignupUserDto) {
    return this.authService.signUpUser(signupUserDto);
  }

  @Public()
  @Post('activate')
  @ApiOperation({ summary: 'Activate user account' })
  @ApiResponse({
    status: 200,
    description: 'User account activated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid OTP or account already activated',
  })
  activateUser(@Body() userActivationDto: UserActivationDto) {
    return this.authService.activateUser(userActivationDto);
  }

  @Public()
  @Post('resend-otp')
  @ApiOperation({ summary: 'Resend OTP for user activation' })
  @ApiResponse({
    status: 200,
    description: 'OTP resent successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid phone number or OTP already sent',
  })
  resendOtp(@Body() resendOtpDto: ResendOtpDto) {
    return this.authService.resendOtp(resendOtpDto);
  }

  @Public()
  @Post('signin')
  @ApiOperation({ summary: 'Sign in as a regular user' })
  @ApiResponse({ status: 200, description: 'User signed in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  signInUser(@Body() createAuthDto: CreateAuthDto, @Req() req: Request) {
    return this.authService.signInUser(createAuthDto, req);
  }

  @Roles(Role.User, Role.ViewerAdmin, Role.SuperAdmin, Role.Admin)
  @Post('signout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sign out a user' })
  @ApiResponse({ status: 200, description: 'User signed out successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized or session expired' })
  signOutUser(@GetUser() user: { id: string }) {
    return this.authService.signOutUser(user.id);
  }

  @Roles(Role.User, Role.ViewerAdmin, Role.SuperAdmin, Role.Admin)
  @UseGuards(RolesGuard)
  @Get('sessions/me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get session data for a user' })
  @ApiResponse({ status: 200, description: 'User sessions returned' })
  @ApiResponse({ status: 404, description: 'User not found or no sessions' })
  getSessions(@GetUser() user: { id: string }) {
    return this.sessionsService.getSessionsByUserId(user.id);
  }

  @Public()
  @Post('signin/admin')
  @ApiOperation({ summary: 'Sign in as an admin' })
  @ApiResponse({ status: 201, description: 'Admin signed in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  signInAdmin(@Body() createAuthDto: CreateAuthDto, @Req() req: Request) {
    return this.authService.signInAdmin(
      createAuthDto.email,
      createAuthDto.password,
      req
    );
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Access token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  @Public()
  refreshToken(@Body() body: { refresh_token: string }) {
    return this.authService.refreshTokens(body.refresh_token);
  }
}
