import { Module } from '@nestjs/common';
import { CapacitiesService } from './capacities.service';
import { CapacitiesController } from './capacities.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [CapacitiesController],
  providers: [CapacitiesService, PrismaService],
})
export class CapacitiesModule {}
