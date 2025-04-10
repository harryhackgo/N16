import {
  BadRequestException,
  Body,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma.service';
import { Prisma, Product } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(@Body() createProductDto: CreateProductDto, imagePath: string | null): Promise<Product> {
    try {
      const created = await this.prisma.product.create({
        data: {...createProductDto, imagePath},
      });
      return created;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new BadRequestException('Category does not exist');
        }
      }
      throw new InternalServerErrorException(
        'Error creating product: ' + error.message,
      );
    }
  }

  async findAll(params: {skip?: number; take?: number; cursor?: Prisma.ProductWhereUniqueInput; where?: Prisma.ProductWhereInput; orderBy?: Prisma.ProductOrderByWithRelationInput}) {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      const foundProducts = await this.prisma.product.findMany({ skip, take, cursor, where, orderBy});
    return foundProducts;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching products: ' + error.message,
      );
    }
  }

  findOne(id: string) {
    try {
      return this.prisma.product.findUnique({
        where: { id }, include: { category: true}
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching product: ' + error.message,
      );
    }
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    try {
      return this.prisma.product.update({
        where: { id },
        data: updateProductDto,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating product: ' + error.message,
      );
    }
  }

  remove(id: string) {
    try {
      return this.prisma.product.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Product not found');
        }
      }
      throw new InternalServerErrorException(
        'Error deleting product: ' + error.message,
      );
    }
  }
}
