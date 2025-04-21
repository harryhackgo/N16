import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { Worker, Prisma } from '@prisma/client';

@Injectable()
export class WorkersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createWorkerDto: CreateWorkerDto): Promise<Worker> {
    try {
      return await this.prisma.worker.create({
        data: createWorkerDto,
        include: {
          level: true,
          workerProficiencies: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new BadRequestException('Invalid related entity reference.');
        }
      }
      throw new InternalServerErrorException(
        'Error creating worker: ' + error.message,
      );
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.WorkerWhereUniqueInput;
    where?: Prisma.WorkerWhereInput;
    orderBy?: Prisma.WorkerOrderByWithRelationInput;
  }): Promise<Worker[]> {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      return await this.prisma.worker.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
        include: {
          level: true,
          workerProficiencies: {
            include: { proficency: true },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching workers: ' + error.message,
      );
    }
  }

  async findOne(id: string): Promise<Worker> {
    try {
      const worker = await this.prisma.worker.findUnique({
        where: { id },
        include: {
          level: true,
          workerProficiencies: {
            include: { proficency: true },
          },
          commentWorkers: true,
        },
      });

      if (!worker) {
        throw new NotFoundException('Worker not found');
      }

      return worker;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching worker: ' + error.message,
      );
    }
  }

  async update(id: string, updateWorkerDto: UpdateWorkerDto): Promise<Worker> {
    try {
      const exists = await this.prisma.worker.findUnique({ where: { id } });
      if (!exists) throw new NotFoundException('Worker not found');

      return await this.prisma.worker.update({
        where: { id },
        data: updateWorkerDto,
        include: {
          level: true,
          workerProficiencies: {
            include: { proficency: true },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating worker: ' + error.message,
      );
    }
  }

  async remove(id: string): Promise<Worker> {
    try {
      const exists = await this.prisma.worker.findUnique({ where: { id } });
      if (!exists) throw new NotFoundException('Worker not found');

      return await this.prisma.worker.delete({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error deleting worker: ' + error.message,
      );
    }
  }
}
