import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { Region, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class RegionsService {
  constructor(private prisma: PrismaService) {}

  async create(createRegionDto: CreateRegionDto): Promise<Region> {
    try {
      return await this.prisma.region.create({
        data: createRegionDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Duplicate unique field');
        }
      }
      throw new InternalServerErrorException(
        'Error creating region: ' + error.message,
      );
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.RegionWhereUniqueInput;
    where?: Prisma.RegionWhereInput;
    orderBy?: Prisma.RegionOrderByWithRelationInput;
  }): Promise<Region[]> {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      return await this.prisma.region.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching regions: ' + error.message,
      );
    }
  }

  async findOne(id: string): Promise<Region> {
    try {
      const region = await this.prisma.region.findUnique({
        where: { id }
      });
      if (!region) throw new NotFoundException('Region not found');
      return region;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching region: ' + error.message,
      );
    }
  }

  async findByName(name: string): Promise<Region> {
    try {
      const region = await this.prisma.region.findFirst({
        where: { name: { equals: name, mode: 'insensitive' } }, 
      });
      if (!region) throw new NotFoundException('Region not found');
      return region;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching region by name: ' + error.message,
      );
    }
  }

  async update(
    id: string,
    updateRegionDto: UpdateRegionDto,
  ): Promise<Region> {
    try {
      const exists = await this.prisma.region.findUnique({ where: { id } });
      if (!exists) throw new NotFoundException('Region not found');

      return await this.prisma.region.update({
        where: { id },
        data: updateRegionDto,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating region: ' + error.message,
      );
    }
  }

  async remove(id: string): Promise<Region> {
    try {
      const exists = await this.prisma.region.findUnique({ where: { id } });
      if (!exists) throw new NotFoundException('Region not found');

      return await this.prisma.region.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Region not found');
        }
      }
      throw new InternalServerErrorException(
        'Error deleting region: ' + error.message,
      );
    }
  }
}
