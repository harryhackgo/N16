import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { Tool, Prisma } from '@prisma/client';

@Injectable()
export class ToolsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createToolDto: CreateToolDto): Promise<Tool> {
    try {
      return await this.prisma.tool.create({
        data: createToolDto,
        include: {
          brand: true,
          sizes: true,
          capacities: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error creating tool: ' + error.message,
      );
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ToolWhereUniqueInput;
    where?: Prisma.ToolWhereInput;
    orderBy?: Prisma.ToolOrderByWithRelationInput;
  }): Promise<Tool[]> {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      return await this.prisma.tool.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
        include: {
          brand: true,
          sizes: true,
          capacities: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching tools: ' + error.message,
      );
    }
  }

  async findOne(id: string): Promise<Tool> {
    try {
      const tool = await this.prisma.tool.findUnique({
        where: { id },
        include: {
          brand: true,
          sizes: true,
          capacities: true,
          favItems: true,
        },
      });
      if (!tool) {
        throw new NotFoundException('Tool not found');
      }
      return tool;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching tool: ' + error.message,
      );
    }
  }

  async update(id: string, updateToolDto: UpdateToolDto): Promise<Tool> {
    try {
      const exists = await this.prisma.tool.findUnique({ where: { id } });
      if (!exists) throw new NotFoundException('Tool not found');

      return await this.prisma.tool.update({
        where: { id },
        data: updateToolDto,
        include: {
          brand: true,
          sizes: true,
          capacities: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating tool: ' + error.message,
      );
    }
  }

  async remove(id: string): Promise<Tool> {
    try {
      const exists = await this.prisma.tool.findUnique({ where: { id } });
      if (!exists) throw new NotFoundException('Tool not found');

      return await this.prisma.tool.delete({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error deleting tool: ' + error.message,
      );
    }
  }
}
