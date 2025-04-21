import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Comment } from '@prisma/client';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCommentDto): Promise<Comment> {
    const { orderId, message, commentWorkers } = dto;

    try {
      const order = await this.prisma.order.findUnique({ where: { id: orderId } });
      if (!order) throw new NotFoundException('Order not found');

      const comment = await this.prisma.comment.create({
        data: { orderId, message },
      });

      for (const cw of commentWorkers) {
        const workerExists = await this.prisma.worker.findUnique({
          where: { id: cw.workerId },
        });

        if (!workerExists) {
          throw new NotFoundException(`Worker with ID ${cw.workerId} not found`);
        }

        await this.prisma.commentWorker.create({
          data: {
            commentId: comment.id,
            workerId: cw.workerId,
            stars: cw.stars,
          },
        });
      }

      return comment;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error creating comment and workers: ' + error.message,
      );
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CommentWhereUniqueInput;
    where?: Prisma.CommentWhereInput;
    orderBy?: Prisma.CommentOrderByWithRelationInput;
  }): Promise<Comment[]> {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      return await this.prisma.comment.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
        include: {
          order: true,
          commentWorkers: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching comments: ' + error.message,
      );
    }
  }

  async findOne(id: string): Promise<Comment> {
    try {
      const found = await this.prisma.comment.findUnique({
        where: { id },
        include: {
          order: true,
          commentWorkers: true,
        },
      });
      if (!found) throw new NotFoundException('Comment not found');
      return found;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching comment: ' + error.message,
      );
    }
  }

  async update(
    commentId: string,
    dto: UpdateCommentDto,
    user: { id: string}
  ): Promise<Comment> {
    const { message, commentWorkers } = dto;

    try {
      const exists = await this.prisma.comment.findUnique({
        where: { id: commentId },
        include: {
          order: true
          }
        }
      );
      if (!exists) throw new NotFoundException('CommentWorker not found');
      if (exists.order.userId !== user.id)
        throw new BadRequestException('You cannot update this comment');
      
      const updatedComment = await this.prisma.comment.update({
        where: { id: commentId },
        data: { message },
      });

      if (!commentWorkers || commentWorkers.length === 0) {
        return updatedComment;
      }
      await this.prisma.commentWorker.deleteMany({
        where: { commentId },
      });
      for (const cw of commentWorkers) {
        const worker = await this.prisma.worker.findUnique({
          where: { id: cw.workerId },
        });

        if (!worker) throw new NotFoundException(`Worker ${cw.workerId} not found`);

        await this.prisma.commentWorker.create({
          data: {
            commentId,
            workerId: cw.workerId,
            stars: cw.stars,
          },
        });
      }

      return updatedComment;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating comment and workers: ' + error.message,
      );
    }
  }

  async remove(id: string, user: {id: string}): Promise<Comment> {
    try {
      const exists = await this.prisma.comment.findUnique({
        where: { id },
        include: {
          order: true
          }
        }
      );
      if (!exists) throw new NotFoundException('CommentWorker not found');
      if (exists.order.userId !== user.id)
        throw new BadRequestException('You cannot update this comment');
      
      return await this.prisma.comment.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Comment not found');
      }
      throw new InternalServerErrorException(
        'Error deleting comment: ' + error.message,
      );
    }
  }
}
