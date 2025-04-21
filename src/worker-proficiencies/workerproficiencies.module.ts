import { Module } from '@nestjs/common';
import {  WorkerProficienciesService } from './workerproficiencies.service';
import {  WorkerProficienciesController } from './workerproficiencies.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [WorkerProficienciesController],
  providers: [WorkerProficienciesService, PrismaService],
})
export class WorkerProficienciesModule {}
