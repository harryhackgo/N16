import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateFavItemDto } from './dto/create-favitem.dto';
import { UpdateFavItemDto } from './dto/update-favitem.dto';
import { FavItems, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class FavItemsService {
  constructor(private prisma: PrismaService) {}

  async create(createFavItemDto: CreateFavItemDto): Promise<FavItems> {
    try {
      return await this.prisma.favItems.create({
        data: createFavItemDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new BadRequestException('Tool or Worker does not exist.');
        }
      }
      throw new InternalServerErrorException(
        'Error creating favorite item: ' + error.message,
      );
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.FavItemsWhereUniqueInput;
    where?: Prisma.FavItemsWhereInput;
    orderBy?: Prisma.FavItemsOrderByWithRelationInput;
  }): Promise<FavItems[]> {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      return await this.prisma.favItems.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,

        include: { favorites: true },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching favorite items: ' + error.message,
      );
    }
  }

  async findOne(id: string): Promise<FavItems> {
    try {
      const item = await this.prisma.favItems.findUnique({
        where: { id },

        include: { favorites: true },
      });
      if (!item) throw new NotFoundException('Favorite item not found');
      return item;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching favorite item: ' + error.message,
      );
    }
  }

  async update(
    id: string,
    updateFavItemDto: UpdateFavItemDto,
  ): Promise<FavItems> {
    try {
      const exists = await this.prisma.favItems.findUnique({ where: { id } });
      if (!exists) throw new NotFoundException('Favorite item not found');

      return await this.prisma.favItems.update({
        where: { id },
        data: updateFavItemDto,
        include: { favorites: true },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating favorite item: ' + error.message,
      );
    }
  }

  async remove(id: string): Promise<FavItems> {
    try {
      const exists = await this.prisma.favItems.findUnique({ where: { id } });
      if (!exists) throw new NotFoundException('Favorite item not found');

      return await this.prisma.favItems.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Favorite item not found');
      }
      throw new InternalServerErrorException(
        'Error deleting favorite item: ' + error.message,
      );
    }
  }
}
