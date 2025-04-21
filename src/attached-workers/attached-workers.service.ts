import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateAttachedWorkerDto } from './dto/create-attached-worker.dto';
import { UpdateAttachedWorkerDto } from './dto/update-attached-worker.dto';
import { AttachedWorker, Prisma } from '@prisma/client';

@Injectable()
export class AttachedWorkersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAttachedWorkerDto): Promise<AttachedWorker> {
    try {
      const [worker, orderWorker] = await Promise.all([
        this.prisma.worker.findUnique({ where: { id: dto.workerId } }),
        this.prisma.orderWorker.findUnique({ where: { id: dto.orderWorkerId } }),
      ]);

      if (!worker) throw new NotFoundException('Worker not found');
      if (!orderWorker) throw new NotFoundException('OrderWorker not found');

      if (!worker.isFree) {
        throw new BadRequestException('Worker is not free');
      }
      
      const res = await this.prisma.attachedWorker.create({
        data: dto,
      });
      await this.prisma.worker.update({
        where: {id: dto.workerId},
        data: {
          isFree: false,
        }
      })
      return res;

    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new BadRequestException('Invalid relation: Worker or OrderWorker not found');
        }
      }
      throw new InternalServerErrorException(
        'Error creating attached worker: ' + error.message,
      );
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.AttachedWorkerWhereUniqueInput;
    where?: Prisma.AttachedWorkerWhereInput;
    orderBy?: Prisma.AttachedWorkerOrderByWithRelationInput;
  }): Promise<AttachedWorker[]> {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      return await this.prisma.attachedWorker.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
        include: {
          worker: true,
          orderWorker: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching attached workers: ' + error.message,
      );
    }
  }

  async findOne(id: string): Promise<AttachedWorker> {
    try {
      const found = await this.prisma.attachedWorker.findUnique({
        where: { id },
        include: {
          worker: true,
          orderWorker: true,
        },
      });
      if (!found) throw new NotFoundException('Attached worker not found');
      return found;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching attached worker: ' + error.message,
      );
    }
  }

  async update(id: string, dto: UpdateAttachedWorkerDto): Promise<AttachedWorker> {
    try {
      const exists = await this.prisma.attachedWorker.findUnique({ where: { id } });
      if (!exists) throw new NotFoundException('Attached worker not found');

      return await this.prisma.attachedWorker.update({
        where: { id },
        data: dto,
        include: {
          worker: true,
          orderWorker: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating attached worker: ' + error.message,
      );
    }
  }

  async remove(id: string): Promise<AttachedWorker> {
    try {
      const exists = await this.prisma.attachedWorker.findUnique({ where: { id } });
      if (!exists) throw new NotFoundException('Attached worker not found');

      return await this.prisma.attachedWorker.delete({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error deleting attached worker: ' + error.message,
      );
    }
  }
}
