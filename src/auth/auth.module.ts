import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { AdminsModule } from '../admins/admins.module';
import { JwtModule } from '@nestjs/jwt';
import { SessionsService } from './sessions.service';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [UsersModule, AdminsModule, JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '60s' },
    global: true,
  })],
  controllers: [AuthController],
  providers: [AuthService, SessionsService, PrismaService],
})
export class AuthModule {}
