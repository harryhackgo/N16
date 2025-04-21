import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { Faq, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class FaqsService {
  constructor(private prisma: PrismaService) {}

  async create(createFaqDto: CreateFaqDto): Promise<Faq> {
    try {
      return await this.prisma.faq.create({
        data: createFaqDto,
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
        'Error creating FAQ: ' + error.message,
      );
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.FaqWhereUniqueInput;
    where?: Prisma.FaqWhereInput;
    orderBy?: Prisma.FaqOrderByWithRelationInput;
  }): Promise<Faq[]> {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      return await this.prisma.faq.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching FAQs: ' + error.message,
      );
    }
  }

  async findOne(id: string): Promise<Faq> {
    try {
      const faq = await this.prisma.faq.findUnique({
        where: { id },
      });
      if (!faq) throw new NotFoundException('FAQ not found');
      return faq;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching FAQ: ' + error.message,
      );
    }
  }

  async update(id: string, updateFaqDto: UpdateFaqDto): Promise<Faq> {
    try {
      return await this.prisma.faq.update({
        where: { id },
        data: updateFaqDto,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating FAQ: ' + error.message,
      );
    }
  }

  async remove(id: string): Promise<Faq> {
    try {
      const exists = await this.prisma.faq.findUnique({ where: { id } });
      if (!exists) throw new NotFoundException('FAQ not found');

      const deletedFaq = await this.prisma.faq.delete({ where: { id } });
      return deletedFaq;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('FAQ not found');
        }
      }
      throw new InternalServerErrorException(
        'Error deleting FAQ: ' + error.message,
      );
    }
  }
}
