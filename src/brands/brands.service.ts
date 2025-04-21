import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  async create(createBrandDto: CreateBrandDto): Promise<Brand> {
    try {
      return await this.prisma.brand.create({
        data: createBrandDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Brand already exists');
        }
      }
      throw new InternalServerErrorException(
        'Error creating brand: ' + error.message,
      );
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.BrandWhereUniqueInput;
    where?: Prisma.BrandWhereInput;
    orderBy?: Prisma.BrandOrderByWithRelationInput;
  }): Promise<Brand[]> {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      return await this.prisma.brand.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching brands: ' + error.message,
      );
    }
  }

  async findOne(id: string): Promise<Brand> {
    try {
      const brand = await this.prisma.brand.findUnique({
        where: { id },
      });
      if (!brand) throw new NotFoundException('Brand not found');
      return brand;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching brand: ' + error.message,
      );
    }
  }

  async findByName(name: string): Promise<Brand> {
    try {
      const brand = await this.prisma.brand.findFirst({
        where: { name: { equals: name, mode: 'insensitive' } },
       
      });
      if (!brand) throw new NotFoundException('Brand not found');
      return brand;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching brand by name: ' + error.message,
      );
    }
  }

  async update(id: string, updateBrandDto: UpdateBrandDto): Promise<Brand> {
    try {
      const exists = await this.prisma.brand.findUnique({ where: { id } });
      if (!exists) throw new NotFoundException('Brand not found');

      return await this.prisma.brand.update({
        where: { id },
        data: updateBrandDto,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating brand: ' + error.message,
      );
    }
  }

  async remove(id: string): Promise<Brand> {
    try {
      const exists = await this.prisma.brand.findUnique({ where: { id } });
      if (!exists) throw new NotFoundException('Brand not found');

      return await this.prisma.brand.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Brand not found');
      }
      throw new InternalServerErrorException(
        'Error deleting brand: ' + error.message,
      );
    }
  }
}
