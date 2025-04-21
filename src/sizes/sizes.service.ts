import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { Size, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SizesService {
  constructor(private prisma: PrismaService) {}

  async create(createSizeDto: CreateSizeDto): Promise<Size> {
    try {
      const tool = await this.prisma.tool.findUnique({
        where: { id: createSizeDto.toolId },
      });
      if (!tool) {
        throw new BadRequestException('Tool not found');
      }
      const existingSize = await this.prisma.size.findFirst({
        where: {
          name: { equals: createSizeDto.name, mode: 'insensitive' },
          toolId: createSizeDto.toolId,
        },
      });
      if (existingSize) {
        throw new BadRequestException('Size already exists for this tool');
      }
      return await this.prisma.size.create({
        data: createSizeDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new BadRequestException('Related tool does not exist');
        }
        if (error.code === 'P2002') {
          throw new BadRequestException('Duplicate size name');
        }
      }
      throw new InternalServerErrorException(
        'Error creating size: ' + error.message,
      );
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.SizeWhereUniqueInput;
    where?: Prisma.SizeWhereInput;
    orderBy?: Prisma.SizeOrderByWithRelationInput;
  }): Promise<Size[]> {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      return await this.prisma.size.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching sizes: ' + error.message,
      );
    }
  }

  async findOne(id: string): Promise<Size> {
    try {
      const size = await this.prisma.size.findUnique({
        where: { id },
      });
      if (!size) throw new NotFoundException('Size not found');
      return size;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching size: ' + error.message,
      );
    }
  }

  async findByName(name: string): Promise<Size> {
    try {
      const size = await this.prisma.size.findFirst({
        where: { name: { equals: name, mode: 'insensitive' } },
      });
      if (!size) throw new NotFoundException('Size not found');
      return size;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching size by name: ' + error.message,
      );
    }
  }

  async update(id: string, updateSizeDto: UpdateSizeDto): Promise<Size> {
    try {
      const exists = await this.prisma.size.findUnique({ where: { id } });
      if (!exists) throw new NotFoundException('Size not found');

      const tool = await this.prisma.tool.findUnique({
        where: { id: updateSizeDto.toolId },
      });
      if (!tool) {  
        throw new BadRequestException('Tool not found');
      }
      const existingSize = await this.prisma.size.findFirst({
        where: {
          name: { equals: updateSizeDto.name, mode: 'insensitive' },
          toolId: updateSizeDto.toolId,
          NOT: { id: id }, // Exclude the current size being updated
        },
      });
      if (existingSize) {
        throw new BadRequestException('Size already exists for this tool');
      }
      return await this.prisma.size.update({
        where: { id },
        data: updateSizeDto,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating size: ' + error.message,
      );
    }
  }

  async remove(id: string): Promise<Size> {
    try {
      const exists = await this.prisma.size.findUnique({ where: { id } });
      if (!exists) throw new NotFoundException('Size not found');

      return await this.prisma.size.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Size not found');
      }
      throw new InternalServerErrorException(
        'Error deleting size: ' + error.message,
      );
    }
  }
}
