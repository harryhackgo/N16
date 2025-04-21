import { Module } from '@nestjs/common';
import { ShowcasesService } from './showcases.service';
import { ShowcasesController } from './showcases.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ShowcasesController],
  providers: [ShowcasesService, PrismaService],
})
export class ShowcasesModule {}
