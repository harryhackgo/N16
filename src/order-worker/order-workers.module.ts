import { Module } from '@nestjs/common';
import {  OrderWorkersService } from './order-workers.service';
import {  OrderWorkersController } from './order-workers.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [OrderWorkersController],
  providers: [OrderWorkersService, PrismaService],
})
export class OrderWorkersModule {}
