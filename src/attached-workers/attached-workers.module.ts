import { Module } from '@nestjs/common';
import { AttachedWorkersService,  } from './attached-workers.service';
import { AttachedWorkersController,  } from './attached-workers.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [AttachedWorkersController],
  providers: [AttachedWorkersService, PrismaService],
})
export class AttachedWorkersModule {}
