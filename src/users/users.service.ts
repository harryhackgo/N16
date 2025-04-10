import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UsersService {
  constructor(private  prisma: PrismaService, private mailService: MailService) {}

  async create(createUserDto: CreateUserDto) {
    try {

      const hashedPassword = await bcrypt.hash(createUserDto.password, 7);
      createUserDto.password = hashedPassword;
      const foundUser = await this.prisma.user.findUnique({
        where: { email: createUserDto.email },
      });
      if (foundUser) {
        throw new InternalServerErrorException(
          'User with this email already exists',
        );
      }
      const newUser = await this.prisma.user.create({ data: createUserDto });
      try {
        await this.mailService.sendMail(newUser)
        
      } catch (error) {
        await this.prisma.user.delete({
          where: { id: newUser.id },
        });
        throw new InternalServerErrorException(
          'Error creating user. ' + error.message,
        );
        
      }
      return {message: "User created successfully. Check your email to activate your account."}
    } catch (error) {
      throw new InternalServerErrorException(
        'Error creating user. ' + error.message,
      );
    }
  }

  async activate(token: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { activationLink: token},
      });
      if (!user) {
        throw new BadRequestException('Invalid activation link');
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: { isActive: true, activationLink: null}
      })

      return { message: 'User activated successfully' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error activating user: ' + error.message,
      );
    }
  }

  async findAll() {
    try {
      const foundUsers = await this.prisma.user.findMany();
      return foundUsers;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching users: ' + error.message,
      );
    }
  }

  async findOne(id: number) {
    try {
      const foundUser = await this.prisma.user.findUnique({
        where: { id },
      });

      return foundUser;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching user: ' + error.message,
      );
    }
  }

  async findOneByEmail(email: string) {
    try {
      const foundUser = await this.prisma.user.findUnique({
        where: { email },
      });

      return foundUser;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching user: ' + error.message,
      );
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });
      return updatedUser;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating user: ' + error.message,
      );
    }
  }

  async remove(id: number) {
    try {
      const delUser = await this.prisma.user.delete({
        where: { id },
      });

      return delUser;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error removing user: ' + error.message,
      );
    }
  }
}
