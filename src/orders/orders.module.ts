import { Module } from '@nestjs/common';
import {  OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaService } from '../prisma.service';
import { TelegramService } from './telegram-bot.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, PrismaService, TelegramService],
})
export class OrdersModule {}
