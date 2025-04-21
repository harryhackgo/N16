import { Module } from '@nestjs/common';
import { FaqsService } from './faqs.service';
import { FaqsController } from './faqs.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [FaqsController],
  providers: [FaqsService, PrismaService],
})
export class FaqsModule {}
