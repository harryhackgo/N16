import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderWorkerDto } from './dto/create-order-worker.dto';
import { UpdateOrderWorkerDto } from './dto/update-order-worker.dto';
import { Prisma, OrderWorker } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class OrderWorkersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrderWorkerDto): Promise<OrderWorker> {
    try {
      return await this.prisma.orderWorker.create({
        data: dto,
        include: {
          workerProficiency: true,
          workerLevel: true,
          attachedWorkers: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new BadRequestException('Related fields are invalid');
        }
      }
      throw new InternalServerErrorException(
        'Error creating OrderWorker: ' + error.message,
      );
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.OrderWorkerWhereUniqueInput;
    where?: Prisma.OrderWorkerWhereInput;
    orderBy?: Prisma.OrderWorkerOrderByWithRelationInput;
  }): Promise<OrderWorker[]> {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      return await this.prisma.orderWorker.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
        include: {
          workerProficiency: true,
          workerLevel: true,
          attachedWorkers: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching OrderWorkers: ' + error.message,
      );
    }
  }

  async findOne(id: string): Promise<OrderWorker> {
    try {
      const orderWorker = await this.prisma.orderWorker.findUnique({
        where: { id },
        include: {
          workerProficiency: true,
          workerLevel: true,
          attachedWorkers: true,
        },
      });

      if (!orderWorker) {
        throw new NotFoundException('OrderWorker not found');
      }

      return orderWorker;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching OrderWorker: ' + error.message,
      );
    }
  }

  async findByOrderId(orderId: string): Promise<OrderWorker[]> {
    try {
      return await this.prisma.orderWorker.findMany({
        where: { orderId },
        include: {
          workerProficiency: true,
          workerLevel: true,
          attachedWorkers: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching OrderWorkers by order ID: ' + error.message,
      );
    }
  }

  async update(id: string, dto: UpdateOrderWorkerDto): Promise<OrderWorker> {
    try {
      const exists = await this.prisma.orderWorker.findUnique({
        where: { id },
      });
      if (!exists) throw new NotFoundException('OrderWorker not found');

      return await this.prisma.orderWorker.update({
        where: { id },
        data: dto,
        include: {
          workerProficiency: true,
          workerLevel: true,
          attachedWorkers: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating OrderWorker: ' + error.message,
      );
    }
  }

  async remove(id: string): Promise<OrderWorker> {
    try {
      const exists = await this.prisma.orderWorker.findUnique({
        where: { id },
      });
      if (!exists) throw new NotFoundException('OrderWorker not found');

      return await this.prisma.orderWorker.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('OrderWorker not found');
      }
      throw new InternalServerErrorException(
        'Error deleting OrderWorker: ' + error.message,
      );
    }
  }
}
