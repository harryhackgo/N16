import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCapacityDto } from './dto/create-capacity.dto';
import { UpdateCapacityDto } from './dto/update-capacity.dto';
import { Capacity, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CapacitiesService {
  constructor(private prisma: PrismaService) {}

  async create(createCapacityDto: CreateCapacityDto): Promise<Capacity> {
    try {
      const tool = await this.prisma.tool.findUnique({
        where: { id: createCapacityDto.toolId },
      });
      if (!tool) {
        throw new BadRequestException('Tool not found');
      }
      const existingCapacity = await this.prisma.capacity.findFirst({
        where: {
          name: { equals: createCapacityDto.name, mode: 'insensitive' },
          toolId: createCapacityDto.toolId,
        },
      });
      if (existingCapacity) {
        throw new BadRequestException('Capacity already exists for this tool');
      }
      return await this.prisma.capacity.create({
        data: createCapacityDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new BadRequestException('Tool does not exist');
        }
        if (error.code === 'P2002') {
          throw new BadRequestException('Duplicate capacity name');
        }
      }
      throw new InternalServerErrorException(
        'Error creating capacity: ' + error.message,
      );
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CapacityWhereUniqueInput;
    where?: Prisma.CapacityWhereInput;
    orderBy?: Prisma.CapacityOrderByWithRelationInput;
  }): Promise<Capacity[]> {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      return await this.prisma.capacity.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
        include: { tool: true },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching capacities: ' + error.message,
      );
    }
  }

  async findOne(id: string): Promise<Capacity> {
    try {
      const capacity = await this.prisma.capacity.findUnique({
        where: { id },
        include: { tool: true },
      });
      if (!capacity) throw new NotFoundException('Capacity not found');
      return capacity;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching capacity: ' + error.message,
      );
    }
  }

  async findByName(name: string): Promise<Capacity> {
    try {
      const capacity = await this.prisma.capacity.findFirst({
        where: { name: { equals: name, mode: 'insensitive' } },
        include: { tool: true },
      });
      if (!capacity) throw new NotFoundException('Capacity not found');
      return capacity;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching capacity by name: ' + error.message,
      );
    }
  }

  async update(id: string, updateCapacityDto: UpdateCapacityDto): Promise<Capacity> {
    try {
      const exists = await this.prisma.capacity.findUnique({ where: { id } });
      if (!exists) throw new NotFoundException('Capacity not found');

      const tool = await this.prisma.tool.findUnique({
        where: { id: updateCapacityDto.toolId },
      });
      if (!tool) {
        throw new BadRequestException('Tool not found');
      }
      const existingCapacity = await this.prisma.capacity.findFirst({
        where: {
          name: { equals: updateCapacityDto.name, mode: 'insensitive' },
          toolId: updateCapacityDto.toolId,
          NOT: { id: id },
        },
      });
      if (existingCapacity) {
        throw new BadRequestException('Capacity already exists for this tool');
      }
      return await this.prisma.capacity.update({
        where: { id },
        data: updateCapacityDto,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating capacity: ' + error.message,
      );
    }
  }

  async remove(id: string): Promise<Capacity> {
    try {
      const exists = await this.prisma.capacity.findUnique({ where: { id } });
      if (!exists) throw new NotFoundException('Capacity not found');

      return await this.prisma.capacity.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Capacity not found');
      }
      throw new InternalServerErrorException(
        'Error deleting capacity: ' + error.message,
      );
    }
  }
}
