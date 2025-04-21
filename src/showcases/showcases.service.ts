import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateShowcaseDto } from './dto/create-showcase.dto';
import { UpdateShowcaseDto } from './dto/update-showcase.dto';
import { Showcase, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ShowcasesService {
  constructor(private prisma: PrismaService) {}

  async create(createShowcaseDto: CreateShowcaseDto): Promise<Showcase> {
    try {
      return await this.prisma.showcase.create({
        data: createShowcaseDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new BadRequestException('Related entity does not exist');
        }
        if (error.code === 'P2002') {
          throw new BadRequestException('Duplicate unique field');
        }
      }
      throw new InternalServerErrorException(
        'Error creating showcase: ' + error.message,
      );
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ShowcaseWhereUniqueInput;
    where?: Prisma.ShowcaseWhereInput;
    orderBy?: Prisma.ShowcaseOrderByWithRelationInput;
  }): Promise<Showcase[]> {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      return await this.prisma.showcase.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching showcases: ' + error.message,
      );
    }
  }

  async findOne(id: string): Promise<Showcase> {
    try {
      const showcase = await this.prisma.showcase.findUnique({
        where: { id },
      });
      if (!showcase) throw new NotFoundException('Showcase not found');
      return showcase;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching showcase: ' + error.message,
      );
    }
  }

  async update(id: string, updateShowcaseDto: UpdateShowcaseDto): Promise<Showcase> {
    try {
      const exists = await this.prisma.showcase.findUnique({ where: { id } });
      if (!exists) throw new NotFoundException('Showcase not found');

      return await this.prisma.showcase.update({
        where: { id },
        data: updateShowcaseDto,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating showcase: ' + error.message,
      );
    }
  }

  async remove(id: string): Promise<Showcase> {
    try {
      const exists = await this.prisma.showcase.findUnique({ where: { id } });
      if (!exists) throw new NotFoundException('Showcase not found');

      return await this.prisma.showcase.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Showcase not found');
        }
      }
      throw new InternalServerErrorException(
        'Error deleting showcase: ' + error.message,
      );
    }
  }
}
