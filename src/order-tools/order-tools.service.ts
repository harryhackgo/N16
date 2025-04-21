import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderToolDto } from './dto/create-order-tool.dto';
import { UpdateOrderToolDto } from './dto/update-order-tool.dto';
import { OrderTool, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class OrderToolsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrderToolDto): Promise<OrderTool> {
    try {
      return await this.prisma.orderTool.create({
        data: dto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new BadRequestException('Invalid order or tool reference.');
        }
      }
      throw new InternalServerErrorException(
        'Error creating OrderTool: ' + error.message,
      );
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.OrderToolWhereUniqueInput;
    where?: Prisma.OrderToolWhereInput;
    orderBy?: Prisma.OrderToolOrderByWithRelationInput;
  }): Promise<OrderTool[]> {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      return await this.prisma.orderTool.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
        include: { tool: true, order: true },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching OrderTools: ' + error.message,
      );
    }
  }

  async findOne(id: string): Promise<OrderTool> {
    try {
      const found = await this.prisma.orderTool.findUnique({
        where: { id },
        include: { tool: true, order: true },
      });
      if (!found) throw new NotFoundException('OrderTool not found');
      return found;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching OrderTool: ' + error.message,
      );
    }
  }

  async update(id: string, dto: UpdateOrderToolDto): Promise<OrderTool> {
    try {
      const exists = await this.prisma.orderTool.findUnique({ where: { id } });
      if (!exists) throw new NotFoundException('OrderTool not found');

      return await this.prisma.orderTool.update({
        where: { id },
        data: dto,
        include: { tool: true, order: true },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating OrderTool: ' + error.message,
      );
    }
  }

  async remove(id: string): Promise<OrderTool> {
    try {
      const exists = await this.prisma.orderTool.findUnique({ where: { id } });
      if (!exists) throw new NotFoundException('OrderTool not found');

      return await this.prisma.orderTool.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('OrderTool not found');
      }
      throw new InternalServerErrorException(
        'Error deleting OrderTool: ' + error.message,
      );
    }
  }
}
