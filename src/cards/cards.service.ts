import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Card, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CardsService {
  constructor(private prisma: PrismaService) {}

  async create(createCardDto: CreateCardDto): Promise<Card> {
    try {
      return await this.prisma.card.create({
        data: createCardDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Card already exists.');
        }
        if (error.code === 'P2003') {
          throw new BadRequestException('User does not exist.');
        }
      }
      throw new InternalServerErrorException(
        'Error creating card: ' + error.message,
      );
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CardWhereUniqueInput;
    where?: Prisma.CardWhereInput;
    orderBy?: Prisma.CardOrderByWithRelationInput;
  }): Promise<Card[]> {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      return await this.prisma.card.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching cards: ' + error.message,
      );
    }
  }

  async findOne(id: string): Promise<Card> {
    try {
      const card = await this.prisma.card.findUnique({
        where: { id },
      });
      if (!card) throw new NotFoundException('Card not found');
      return card;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching card: ' + error.message,
      );
    }
  }

  async update(id: string, updateCardDto: UpdateCardDto): Promise<Card> {
    try {
      const exists = await this.prisma.card.findUnique({ where: { id } });
      if (!exists) throw new NotFoundException('Card not found');

      return await this.prisma.card.update({
        where: { id },
        data: updateCardDto,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating card: ' + error.message,
      );
    }
  }

  async remove(id: string): Promise<Card> {
    try {
      const exists = await this.prisma.card.findUnique({ where: { id } });
      if (!exists) throw new NotFoundException('Card not found');

      return await this.prisma.card.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Card not found');
      }
      throw new InternalServerErrorException(
        'Error deleting card: ' + error.message,
      );
    }
  }
}
