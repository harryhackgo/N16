import { BadRequestException, Body, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const created = await this.prisma.category.create({
        data: createCategoryDto
      });
      return created;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new BadRequestException('Category does not exist');
        }
      }
      throw new InternalServerErrorException(
        'Error creating category: ' + error.message,
      );
    }
  }

  async findAll(params: {skip?: number; take?: number; cursor?: Prisma.CategoryWhereUniqueInput; where?: Prisma.CategoryWhereInput; orderBy?: Prisma.CategoryOrderByWithRelationInput}) {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      const foundCategorys = await this.prisma.category.findMany({ skip, take, cursor, where, orderBy});
    return foundCategorys;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching categorys: ' + error.message,
      );
    }
  }

  findOne(id: string) {
    try {
      return this.prisma.category.findUnique({
        where: { id }, include: { products: true}
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching category: ' + error.message,
      );
    }
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      return this.prisma.category.update({
        where: { id },
        data: updateCategoryDto,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating category: ' + error.message,
      );
    }
  }

  remove(id: string) {
    try {
      return this.prisma.category.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Category not found');
        }
      }
      throw new InternalServerErrorException(
        'Error deleting category: ' + error.message,
      );
    }
  }
}

