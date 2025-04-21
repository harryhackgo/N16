import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { PrismaService } from '../prisma.service';
import { Level, Prisma } from '@prisma/client';

@Injectable()
export class LevelsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateLevelDto): Promise<Level> {
    try {
      return await this.prisma.level.create({ data: dto });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Level with this name already exists');
      }
      throw new InternalServerErrorException('Error creating level: ' + error.message);
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.LevelWhereUniqueInput;
    where?: Prisma.LevelWhereInput;
    orderBy?: Prisma.LevelOrderByWithRelationInput;
  }): Promise<Level[]> {
    try {
      return await this.prisma.level.findMany({
        ...params
      });
    } catch (error) {
      throw new InternalServerErrorException('Error fetching levels: ' + error.message);
    }
  }

  async findOne(id: string): Promise<Level> {
    try {
      const level = await this.prisma.level.findUnique({
        where: { id },
      });
      if (!level) throw new NotFoundException('Level not found');
      return level;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching level: ' + error.message);
    }
  }

  async findByName(name: string): Promise<Level> {
    try {
      const level = await this.prisma.level.findFirst({
        where: { name: { equals: name, mode: 'insensitive' } },
      });
      if (!level) throw new NotFoundException('Level not found');
      return level;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching level by name: ' + error.message);
    }
  }

  async update(id: string, dto: UpdateLevelDto): Promise<Level> {
    try {
      const level = await this.findOne(id);
      if (!level) throw new NotFoundException('Level not found');
      return await this.prisma.level.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      throw new InternalServerErrorException('Error updating level: ' + error.message);
    }
  }

  async remove(id: string): Promise<Level> {
    try {
      const level = await this.findOne(id);
      if (!level) throw new NotFoundException('Level not found');
      return await this.prisma.level.delete({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException('Error deleting level: ' + error.message);
    }
  }
}
