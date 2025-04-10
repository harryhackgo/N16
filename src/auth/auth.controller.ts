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
import { PassThrough } from 'stream';
import { SessionsService } from './sessions.service';
import { AuthGuard } from '../guards/auth.guard';
import { Role } from '../enums/role.enum';
import { RolesGuard } from '../guards/roles.guard';
import { SelfGuard } from '../guards/self.guard';
import { Roles } from '../decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private  authService: AuthService, private sessionsService: SessionsService) {}
  
  @Public()
  @Post('signin')
  singInUser(@Body() createAuthDto: CreateAuthDto, @Req() req: Request) {
    return this.authService.signInUser(
      createAuthDto.email,
      createAuthDto.password,
      req,
    );
  }

  @Roles(Role.User)
  @UseGuards( RolesGuard, SelfGuard)
  @Post('signout')
  signOutUser(@Body('userId') userId: number) {
    return this.authService.signOutUser(userId);
  }

  @Roles(Role.User, Role.SuperAdmin)
  @UseGuards( RolesGuard, SelfGuard)
  @Get('sessions/:id')
  getSessions(@Param('id') id: number) {
    return this.sessionsService.getSessions(id);
  }

  @Public()
  @Post('admins/signin')
  singInAdmin(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.signInAdmin(
      createAuthDto.email,
      createAuthDto.password,
    );
  }
}
