import { Module } from '@nestjs/common';
import { CommentWorkersService } from './comment-workers.service';
import { CommentWorkersController } from './comment-workers.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [CommentWorkersController],
  providers: [CommentWorkersService, PrismaService],
})
export class CommentWorkersModule {}
