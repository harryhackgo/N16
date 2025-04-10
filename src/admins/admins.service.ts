import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AdminsService {
  constructor(private prisma: PrismaService) {}

  async create(createAdminDto: CreateAdminDto) {
    try {

      const hashedPassword = await bcrypt.hash(createAdminDto.password, 7);
      createAdminDto.password = hashedPassword;
      const foundAdmin = await this.prisma.admin.findUnique({
        where: { email: createAdminDto.email },
      });
      if (foundAdmin) {
        throw new InternalServerErrorException(
          'Admin with this email already exists',
        );
      }
      return this.prisma.admin.create({ data: createAdminDto });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error creating admin. ' + error.message,
      );
    }
  }

  async findAll(params: {skip?: number; take?: number; cursor?: Prisma.AdminWhereUniqueInput; where?: Prisma.AdminWhereInput; orderBy?: Prisma.AdminOrderByWithRelationInput}) {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      const foundAdmins = await this.prisma.admin.findMany({ skip, take, cursor, where, orderBy});
      return foundAdmins
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching admins: ' + error.message,
      );
    }
  }

  async findOne(id: number) {
    try {
      const foundAdmin = await this.prisma.admin.findUnique({
        where: { id: id },
      });

      return foundAdmin;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching admin: ' + error.message,
      );
    }
  }

  async findOneByEmail(email: string) {
    try {
      const foundAdmin = await this.prisma.admin.findUnique({
        where: { email },
      });

      return foundAdmin;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching admin: ' + error.message,
      );
    }
  }


  async update(id: number, updateAdminDto: UpdateAdminDto) {
    try {
      const updatedAdmin = await this.prisma.admin.update({
        where: { id },
        data: updateAdminDto,
      });
      return updatedAdmin;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating admin: ' + error.message,
      );
    }
  }

  async remove(id: number) {
    try {
      const delAdmin = await this.prisma.admin.delete({
        where: { id },
      });
      return delAdmin;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error removing admin: ' + error.message,
      );
    }
  }
}
