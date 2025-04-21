import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, Prisma } from '@prisma/client';
import { TelegramService } from './telegram-bot.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService,
    private botService: TelegramService,
  ) {}

  async create(dto: CreateOrderDto) {
    const {
      userId,
      status,
      date,
      address,
      overallPrice,
      paymentMethodId,
      withDelivery,
      deliveryComment,
      longitude,
      latitude,
      orderTools,
      orderWorkers,
    } = dto;

    try {
      
      const order = await this.prisma.order.create({
        data: {
          userId,
          status,
          date,
          address,
          overallPrice,
          paymentMethodId,
          withDelivery,
          deliveryComment,
          longitude,
          latitude,
        },
      });

      
      if (orderTools && orderTools.length > 0) {
        for (const tool of orderTools) {
          const toolExists = await this.prisma.tool.findUnique({
            where: { id: tool.toolId },
          });

          if (!toolExists) {
            throw new NotFoundException(`Tool with id ${tool.toolId} not found`);
          }
          if (toolExists.inStockCount < tool.count) {
            throw new BadRequestException(
              `Not enough stock for tool with id ${tool.toolId}`,
            );
          }
          await this.prisma.orderTool.create({
            data: {
              orderId: order.id,
              toolId: tool.toolId,
              count: tool.count,
              price: tool.price,
            },
          });
          await this.prisma.tool.update({
            where: { id: tool.toolId },
            data: {
              inStockCount: {
                decrement: tool.count,
              },
            },
          });
        }
      }

      if (orderWorkers && orderWorkers.length > 0) {
        for (const worker of orderWorkers) {
          const proficencyExists = await this.prisma.proficency.findUnique({
            where: { id: worker.workerProficiencyId },
          });

          const levelExists = await this.prisma.level.findUnique({
            where: { id: worker.workerLevelId },
          });

          if (!proficencyExists) {
            throw new NotFoundException(
              `Worker proficiency with id ${worker.workerProficiencyId} not found`,
            );
          }

          if (!levelExists) {
            throw new NotFoundException(
              `Worker level with id ${worker.workerLevelId} not found`,
            );
          }

          await this.prisma.orderWorker.create({
            data: {
              orderId: order.id,
              workerProficiencyId: worker.workerProficiencyId,
              workerLevelId: worker.workerLevelId,
              count: worker.count,
              withTools: worker.withTools,
              time: worker.time,
              timeUnit: worker.timeUnit,
              price: worker.price,
            },
          });
        }
      }

      const createdOrder = await this.prisma.order.findUnique({
        where: { id: order.id },
        include: {
          user: true,
          paymentMethod: true,
          orderTools: true,
          orderWorkers: {
            include: {
              workerProficiency: true,
              workerLevel: true,
            }
          },
          comments: true,
        },
      });
      await this.botService.sendOrderNotification(createdOrder);
      return createdOrder
    } catch (error) {
      throw new InternalServerErrorException('Error creating order: ' + error.message);
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.OrderWhereUniqueInput;
    where?: Prisma.OrderWhereInput;
    orderBy?: Prisma.OrderOrderByWithRelationInput;
  }): Promise<Order[]> {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      return await this.prisma.order.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
        include: {
          user: true,
          paymentMethod: true,
          orderTools: true,
          orderWorkers: true,
          comments: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error fetching orders: ' + error.message);
    }
  }

  async findOne(id: string): Promise<Order> {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id },
        include: {
          user: true,
          paymentMethod: true,
          orderTools: true,
          orderWorkers: true,
          comments: true,
        },
      });
      if (!order) throw new NotFoundException('Order not found');
      return order;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching order: ' + error.message);
    }
  }

  async update(id: string, dto: UpdateOrderDto): Promise<Order> {
    try {
      const exists = await this.prisma.order.findUnique({ where: { id } });
      if (!exists) throw new NotFoundException('Order not found');

      return await this.prisma.order.update({
        where: { id },
        data: dto,
        include: {
          user: true,
          paymentMethod: true,
          orderTools: true,
          orderWorkers: true,
          comments: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error updating order: ' + error.message);
    }
  }

  async remove(id: string): Promise<Order> {
    try {
      const exists = await this.prisma.order.findUnique({ where: { id } });
      if (!exists) throw new NotFoundException('Order not found');

      return await this.prisma.order.delete({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException('Error deleting order: ' + error.message);
    }
  }
}
