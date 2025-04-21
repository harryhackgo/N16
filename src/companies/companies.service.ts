import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: createCompanyDto.userId },
      });
      if (!user) {
        throw new BadRequestException('User does not exist');
      }
      return await this.prisma.company.create({
        data: createCompanyDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('A company with this email already exists');
        }
      }
      throw new InternalServerErrorException(
        'Error creating company: ' + error.message,
      );
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CompanyWhereUniqueInput;
    where?: Prisma.CompanyWhereInput;
    orderBy?: Prisma.CompanyOrderByWithRelationInput;
  }): Promise<Company[]> {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      return await this.prisma.company.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching companies: ' + error.message,
      );
    }
  }

  async findOne(id: string): Promise<Company> {
    try {
      const company = await this.prisma.company.findUnique({
        where: { id },
      });
      if (!company) throw new NotFoundException('Company not found');
      return company;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching company: ' + error.message,
      );
    }
  }

  async findByName(name: string): Promise<Company> {
    try {
      const company = await this.prisma.company.findFirst({
        where: { name: { equals: name, mode: 'insensitive' } },
      });
      if (!company) throw new NotFoundException('Company not found');
      return company;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching company by name: ' + error.message,
      );
    }
  }

  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    try {
      const exists = await this.prisma.company.findUnique({ where: { id } });
      if (!exists) throw new NotFoundException('Company not found');

      const user = await this.prisma.user.findUnique({
        where: { id: updateCompanyDto.userId },
      });
      if (!user) {
        throw new BadRequestException('User does not exist');
      }
      return await this.prisma.company.update({
        where: { id },
        data: updateCompanyDto,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating company: ' + error.message,
      );
    }
  }

  async remove(id: string): Promise<Company> {
    try {
      const exists = await this.prisma.company.findUnique({ where: { id } });
      if (!exists) throw new NotFoundException('Company not found');

      return await this.prisma.company.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Company not found');
      }
      throw new InternalServerErrorException(
        'Error deleting company: ' + error.message,
      );
    }
  }
}
