import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateGeneralDto } from './dto/create-general.dto';
import { UpdateGeneralDto } from './dto/update-general.dto';
import { General, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class GeneralsService {
  constructor(private prisma: PrismaService) {}

  async create(createGeneralDto: CreateGeneralDto): Promise<General> {
    try {
      const created = await this.prisma.general.create({
        data: createGeneralDto,
      });
      return created;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new BadRequestException('Related entity does not exist');
        } else if (error.code === 'P2002') {
          throw new BadRequestException('Duplicate field value');
        }
      }
      throw new InternalServerErrorException(
        'Error creating general info: ' + error.message,
      );
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.GeneralWhereUniqueInput;
    where?: Prisma.GeneralWhereInput;
    orderBy?: Prisma.GeneralOrderByWithRelationInput;
  }): Promise<General[]> {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      return await this.prisma.general.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching general info: ' + error.message,
      );
    }
  }

  async findOne(id: string): Promise<General> {
    try {
      const general = await this.prisma.general.findUnique({
        where: { id },
      });
      if (!general) throw new NotFoundException('General info not found');
      return general;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching general info: ' + error.message,
      );
    }
  }

  async update(
    id: string,
    updateGeneralDto: UpdateGeneralDto,
  ): Promise<General> {
    try {
      return await this.prisma.general.update({
        where: { id },
        data: updateGeneralDto,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating general info: ' + error.message,
      );
    }
  }

  async remove(id: string): Promise<General> {
    try {
      return await this.prisma.general.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('General info not found');
        }
      }
      throw new InternalServerErrorException(
        'Error deleting general info: ' + error.message,
      );
    }
  }
}
