import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateWorkerProficiencyDto } from './dto/create-workerproficiency.dto';
import { UpdateWorkerProficiencyDto } from './dto/update-workerproficiency.dto';
import { WorkerProficiency, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class WorkerProficienciesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateWorkerProficiencyDto): Promise<WorkerProficiency> {
    try {
      return await this.prisma.workerProficiency.create({
        data: dto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new BadRequestException('Worker or Proficiency not found.');
        }
      }
      throw new InternalServerErrorException(
        'Error creating WorkerProficiency: ' + error.message,
      );
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.WorkerProficiencyWhereUniqueInput;
    where?: Prisma.WorkerProficiencyWhereInput;
    orderBy?: Prisma.WorkerProficiencyOrderByWithRelationInput;
  }): Promise<WorkerProficiency[]> {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      return await this.prisma.workerProficiency.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
        include: {
          worker: true,
          proficency: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching WorkerProficiencies: ' + error.message,
      );
    }
  }

  async findOne(id: string): Promise<WorkerProficiency> {
    try {
      const record = await this.prisma.workerProficiency.findUnique({
        where: { id },
        include: {
          worker: true,
          proficency: true,
        },
      });
      if (!record) throw new NotFoundException('WorkerProficiency not found');
      return record;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching WorkerProficiency: ' + error.message,
      );
    }
  }

  async update(
    id: string,
    dto: UpdateWorkerProficiencyDto,
  ): Promise<WorkerProficiency> {
    try {
      const exists = await this.prisma.workerProficiency.findUnique({
        where: { id },
      });
      if (!exists) throw new NotFoundException('WorkerProficiency not found');

      return await this.prisma.workerProficiency.update({
        where: { id },
        data: dto,
        include: {
          worker: true,
          proficency: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating WorkerProficiency: ' + error.message,
      );
    }
  }

  async remove(id: string): Promise<WorkerProficiency> {
    try {
      const exists = await this.prisma.workerProficiency.findUnique({
        where: { id },
      });
      if (!exists) throw new NotFoundException('WorkerProficiency not found');

      return await this.prisma.workerProficiency.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('WorkerProficiency not found');
      }
      throw new InternalServerErrorException(
        'Error deleting WorkerProficiency: ' + error.message,
      );
    }
  }
}
