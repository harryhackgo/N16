import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { Partner, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PartnersService {
  constructor(private prisma: PrismaService) {}

  async create(createPartnerDto: CreatePartnerDto): Promise<Partner> {
    try {
      return await this.prisma.partner.create({
        data: createPartnerDto,
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
        'Error creating partner: ' + error.message,
      );
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PartnerWhereUniqueInput;
    where?: Prisma.PartnerWhereInput;
    orderBy?: Prisma.PartnerOrderByWithRelationInput;
  }): Promise<Partner[]> {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      return await this.prisma.partner.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching partners: ' + error.message,
      );
    }
  }

  async findOne(id: string): Promise<Partner> {
    try {
      const partner = await this.prisma.partner.findUnique({
        where: { id },
      });
      if (!partner) throw new NotFoundException('Partner not found');
      return partner;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching partner: ' + error.message,
      );
    }
  }

  async update(id: string, updatePartnerDto: UpdatePartnerDto): Promise<Partner> {
    try {
      return await this.prisma.partner.update({
        where: { id },
        data: updatePartnerDto,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating partner: ' + error.message,
      );
    }
  }

  async remove(id: string): Promise<Partner> {
    try {
      return await this.prisma.partner.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Partner not found');
        }
      }
      throw new InternalServerErrorException(
        'Error deleting partner: ' + error.message,
      );
    }
  }
}
