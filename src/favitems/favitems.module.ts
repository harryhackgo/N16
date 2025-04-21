import { Module } from '@nestjs/common';
import {  FavItemsService } from './favitems.service';
import {  FavItemsController } from './favitems.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [FavItemsController],
  providers: [FavItemsService, PrismaService],
})
export class FavItemsModule {}
