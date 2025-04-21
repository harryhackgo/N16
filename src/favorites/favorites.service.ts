import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { Favorites, Prisma } from '@prisma/client';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateFavoriteDto): Promise<Favorites> {
    const { userId, itemId, favItem } = data;

    if (!itemId && !favItem) {
      throw new BadRequestException('Either itemId or favItem must be provided.');
    }

    try {
      let finalItemId = itemId;

      if (!itemId && favItem) {
        const createdItem = await this.prisma.favItems.create({
          data: favItem,
        });
        finalItemId = createdItem.id;
      }

      const existing = await this.prisma.favorites.findFirst({
        where: { userId, itemId: finalItemId },
      });

      if (existing) {
        throw new BadRequestException('This item is already in favorites.');
      }

      return await this.prisma.favorites.create({
        data: {
          userId,
          itemId: finalItemId!,
        },
        include: {
          item: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error creating favorite: ' + error.message,
      );
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.FavoritesWhereUniqueInput;
    where?: Prisma.FavoritesWhereInput;
    orderBy?: Prisma.FavoritesOrderByWithRelationInput;
  }): Promise<Favorites[]> {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      return await this.prisma.favorites.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
        include: {
          item: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching favorites: ' + error.message,
      );
    }
  }

  async findOne(id: string): Promise<Favorites> {
    try {
      const favorite = await this.prisma.favorites.findUnique({
        where: { id },
        include: {
          item: true,
        },
      });

      if (!favorite) throw new NotFoundException('Favorite not found');
      return favorite;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching favorite: ' + error.message,
      );
    }
  }

  async update(
    id: string,
    updateDto: UpdateFavoriteDto,
  ): Promise<Favorites> {
    const { itemId, favItem } = updateDto;

    try {
      const favorite = await this.prisma.favorites.findUnique({
        where: { id },
        include: { item: true },
      });

      if (!favorite) throw new NotFoundException('Favorite not found');

      let updatedItemId = favorite.itemId;

      if (itemId && itemId !== favorite.itemId) {
        const newItem = await this.prisma.favItems.findUnique({
          where: { id: itemId },
        });

        if (!newItem) {
          throw new BadRequestException('Provided itemId does not exist.');
        }

        updatedItemId = itemId;
      }

      if (favItem) {
        await this.prisma.favItems.update({
          where: { id: updatedItemId },
          data: favItem,
        });
      }

      return await this.prisma.favorites.update({
        where: { id },
        data: { itemId: updatedItemId },
        include: {
          item: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating favorite: ' + error.message,
      );
    }
  }

  async remove(id: string): Promise<Favorites> {
    try {
      const exists = await this.prisma.favorites.findUnique({ where: { id } });

      if (!exists) throw new NotFoundException('Favorite not found');

      return await this.prisma.favorites.delete({
        where: { id },
        include: { item: true },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Favorite not found');
      }
      throw new InternalServerErrorException(
        'Error deleting favorite: ' + error.message,
      );
    }
  }
}
