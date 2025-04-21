import { Module } from '@nestjs/common';
import { OrderToolsService } from './order-tools.service';
import { OrderToolsController,  } from './order-tools.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [OrderToolsController],
  providers: [OrderToolsService, PrismaService],
})
export class OrderToolsModule {}
