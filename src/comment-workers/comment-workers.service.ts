import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, CommentWorker } from '@prisma/client';
import { CreateCommentWorkerDto } from './dto/create-comment-worker.dto';
import { UpdateCommentWorkerDto } from './dto/update-comment-worker.dto';

@Injectable()
export class CommentWorkersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCommentWorkerDto): Promise<CommentWorker> {
    try {
      const [worker, comment] = await Promise.all([
        this.prisma.worker.findUnique({ where: { id: dto.workerId } }),
        this.prisma.comment.findUnique({ where: { id: dto.commentId } }),
      ]);

      if (!worker) throw new NotFoundException('Worker not found');
      if (!comment) throw new NotFoundException('Comment not found');

      return await this.prisma.commentWorker.create({
        data: dto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Duplicate comment for worker');
        }
        if (error.code === 'P2003') {
          throw new BadRequestException('Invalid relation data');
        }
      }
      throw new InternalServerErrorException(
        'Error creating comment-worker: ' + error.message,
      );
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CommentWorkerWhereUniqueInput;
    where?: Prisma.CommentWorkerWhereInput;
    orderBy?: Prisma.CommentWorkerOrderByWithRelationInput;
  }): Promise<CommentWorker[]> {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      return await this.prisma.commentWorker.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
        include: {
          comment: true,
          worker: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching comment-workers: ' + error.message,
      );
    }
  }

  async findOne(id: string): Promise<CommentWorker> {
    try {
      const found = await this.prisma.commentWorker.findUnique({
        where: { id },
        include: {
          comment: true,
          worker: true,
        },
      });
      if (!found) throw new NotFoundException('CommentWorker not found');
      return found;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching comment-worker: ' + error.message,
      );
    }
  }

  async update(
    id: string,
    dto: UpdateCommentWorkerDto,
    user: { id: string}
  ): Promise<CommentWorker> {
    try {
      const exists = await this.prisma.commentWorker.findUnique({
        where: { id },
        include: {
          comment: {
            include: {
              order: true,
              }
            }
          }
        }
      );
      if (!exists?.comment.order.userId) throw new NotFoundException('CommentWorker not found');
      if (exists.comment.order.userId !== user.id)
        throw new BadRequestException('You cannot update this comment');
      
      return await this.prisma.commentWorker.update({
        where: { id },
        data: dto,
        include: {
          comment: true,
          worker: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating comment-worker: ' + error.message,
      );
    }
  }

  async remove(id: string, user: { id: string}): Promise<CommentWorker> {
    try {
      const exists = await this.prisma.commentWorker.findUnique({
        where: { id },
        include: {
          comment: {
            include: {
              order: true,
              }
            }
          }
        }
      );
      if (!exists?.comment.order.userId) throw new NotFoundException('CommentWorker not found');
      if (exists.comment.order.userId !== user.id)
        throw new BadRequestException('You cannot update this comment');
      
      return await this.prisma.commentWorker.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('CommentWorker not found');
      }
      throw new InternalServerErrorException(
        'Error deleting comment-worker: ' + error.message,
      );
    }
  }
}
