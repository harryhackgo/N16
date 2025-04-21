import { Module } from '@nestjs/common';
import { ProficienciesService } from './proficencies.service';
import { ProficienciesController } from './proficencies.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ProficienciesController],
  providers: [ProficienciesService, PrismaService],
})
export class ProficienciesModule {}
