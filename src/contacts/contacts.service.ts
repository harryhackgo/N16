import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    try {
      const created = await this.prisma.contact.create({
        data: createContactDto,
      });
      return created;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new BadRequestException('Related entity does not exist');
        }
      }
      throw new InternalServerErrorException(
        'Error creating contact: ' + error.message,
      );
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ContactWhereUniqueInput;
    where?: Prisma.ContactWhereInput;
    orderBy?: Prisma.ContactOrderByWithRelationInput;
  }): Promise<Contact[]> {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      const foundContacts = await this.prisma.contact.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      });
      return foundContacts;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching contacts: ' + error.message,
      );
    }
  }

  async findOne(id: string): Promise<Contact> {
    try {
      const contact = await this.prisma.contact.findUnique({
        where: { id },
      });
      if (!contact) throw new NotFoundException('Contact not found');
      return contact;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching contact: ' + error.message,
      );
    }
  }

  async update(id: string, updateContactDto: UpdateContactDto): Promise<Contact> {
    try {
      return await this.prisma.contact.update({
        where: { id },
        data: updateContactDto,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating contact: ' + error.message,
      );
    }
  }

  async remove(id: string): Promise<Contact> {
    try {
      return await this.prisma.contact.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Contact not found');
        }
      }
      throw new InternalServerErrorException(
        'Error deleting contact: ' + error.message,
      );
    }
  }
}
