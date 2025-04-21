import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { PaymentMethod, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PaymentMethodsService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreatePaymentMethodDto): Promise<PaymentMethod> {
    try {
      return await this.prisma.paymentMethod.create({
        data: createDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Payment method with this name already exists.');
        }
      }
      throw new InternalServerErrorException(
        'Error creating payment method: ' + error.message,
      );
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PaymentMethodWhereUniqueInput;
    where?: Prisma.PaymentMethodWhereInput;
    orderBy?: Prisma.PaymentMethodOrderByWithRelationInput;
  }): Promise<PaymentMethod[]> {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      return await this.prisma.paymentMethod.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching payment methods: ' + error.message,
      );
    }
  }

  async findOne(id: string): Promise<PaymentMethod> {
    try {
      const method = await this.prisma.paymentMethod.findUnique({
        where: { id },
      });
      if (!method) throw new NotFoundException('Payment method not found');
      return method;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching payment method: ' + error.message,
      );
    }
  }

  async update(
    id: string,
    updateDto: UpdatePaymentMethodDto,
  ): Promise<PaymentMethod> {
    try {
      const exists = await this.prisma.paymentMethod.findUnique({
        where: { id },
      });
      if (!exists) throw new NotFoundException('Payment method not found');

      return await this.prisma.paymentMethod.update({
        where: { id },
        data: updateDto,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating payment method: ' + error.message,
      );
    }
  }

  async remove(id: string): Promise<PaymentMethod> {
    try {
      const exists = await this.prisma.paymentMethod.findUnique({
        where: { id },
      });
      if (!exists) throw new NotFoundException('Payment method not found');

      return await this.prisma.paymentMethod.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Payment method not found');
      }
      throw new InternalServerErrorException(
        'Error deleting payment method: ' + error.message,
      );
    }
  }
}
