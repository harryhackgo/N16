import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProficencyDto } from './dto/create-proficency.dto';
import { UpdateProficencyDto } from './dto/update-proficency.dto';
import { Proficency, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProficienciesService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateProficencyDto): Promise<Proficency> {
    try {
      return await this.prisma.proficency.create({
        data: createDto,
        include: { parent: true, children: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new BadRequestException('Parent proficiency not found');
        }
        if (error.code === 'P2002') {
          throw new BadRequestException('Proficiency with this name already exists');
        }
      }
      throw new InternalServerErrorException(
        'Error creating proficiency: ' + error.message,
      );
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ProficencyWhereUniqueInput;
    where?: Prisma.ProficencyWhereInput;
    orderBy?: Prisma.ProficencyOrderByWithRelationInput;
  }): Promise<Proficency[]> {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      return await this.prisma.proficency.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
        include: { parent: true, children: true },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching proficiencies: ' + error.message,
      );
    }
  }

  async findOne(id: string): Promise<Proficency> {
    try {
      const prof = await this.prisma.proficency.findUnique({
        where: { id },
        include: { parent: true, children: true },
      });
      if (!prof) throw new NotFoundException('Proficiency not found');
      return prof;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching proficiency: ' + error.message,
      );
    }
  }

  async findByName(name: string): Promise<Proficency> {
    try {
      const prof = await this.prisma.proficency.findFirst({
        where: { name: { equals: name, mode: 'insensitive' } },
        include: { parent: true, children: true },
      });
      if (!prof) throw new NotFoundException('Proficiency not found');
      return prof;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching proficiency by name: ' + error.message,
      );
    }
  }

  async update(id: string, updateDto: UpdateProficencyDto): Promise<Proficency> {
    try {
      const exists = await this.prisma.proficency.findUnique({ where: { id } });
      if (!exists) throw new NotFoundException('Proficiency not found');

      return await this.prisma.proficency.update({
        where: { id },
        data: updateDto,
        include: { parent: true, children: true },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating proficiency: ' + error.message,
      );
    }
  }

  async remove(id: string): Promise<Proficency> {
    try {
      const exists = await this.prisma.proficency.findUnique({ where: { id } });
      if (!exists) throw new NotFoundException('Proficiency not found');

      return await this.prisma.proficency.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Proficiency not found');
      }
      throw new InternalServerErrorException(
        'Error deleting proficiency: ' + error.message,
      );
    }
  }
}
