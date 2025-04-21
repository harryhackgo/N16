import { Module } from '@nestjs/common';
import {  GeneralsService } from './generals.service';
import {  GeneralsController } from './generals.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [GeneralsController],
  providers: [GeneralsService, PrismaService],
})
export class GeneralsModule {}
