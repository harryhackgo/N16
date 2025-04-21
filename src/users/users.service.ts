import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    // private readonly mailService: MailService,
  ) {}

  // async create(createUserDto: CreateUserDto): Promise<{ message: string }> {
  //   try {
  //     const hashedPassword = await bcrypt.hash(createUserDto.password, 7);
  //     createUserDto.password = hashedPassword;

  //     const existingUser = await this.prisma.user.findUnique({
  //       where: { email: createUserDto.email },
  //     });

  //     if (existingUser) {
  //       throw new BadRequestException('User with this email already exists');
  //     }

  //     const newUser = await this.prisma.user.create({ data: createUserDto });

  //     try {
  //       await this.mailService.sendMail(newUser);
  //     } catch (mailError) {
  //       await this.prisma.user.delete({ where: { id: newUser.id } });
  //       throw new InternalServerErrorException(
  //         'Failed to send email: ' + mailError.message,
  //       );
  //     }

  //     return {
  //       message:
  //         'User created successfully. Check your email to activate your account.',
  //     };
  //   } catch (error) {
  //     throw new InternalServerErrorException(
  //       'Error creating user: ' + error.message,
  //     );
  //   }
  // }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    try {
      const { skip, take, cursor, where, orderBy } = params;

      return await this.prisma.user.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
        include: { companies: true}
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching users: ' + error.message,
      );
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id }, include: { companies: true} });

      if (!user) throw new NotFoundException('User not found');

      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching user: ' + error.message,
      );
    }
  }

  async findOneByEmail(email: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({ where: { email }, include: { companies: true} });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching user by email: ' + error.message,
      );
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) throw new NotFoundException('User not found');

      return await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating user: ' + error.message,
      );
    }
  }

  async remove(id: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) throw new NotFoundException('User not found');

      return await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error deleting user: ' + error.message,
      );
    }
  }
}
