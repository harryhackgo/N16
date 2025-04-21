import { Module } from '@nestjs/common';
import {  LevelsService } from './levels.service';
import {  LevelsController } from './levels.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [LevelsController],
  providers: [LevelsService, PrismaService],
})
export class LevelsModule {}
