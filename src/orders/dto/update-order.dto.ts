import { ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus, PaymentStatus } from '@prisma/client';

export class UpdateOrderDto {
  @ApiPropertyOptional({ example: '2024-04-21T10:00:00Z' })
  date?: Date;

  @ApiPropertyOptional({ example: 'Tashkent, Uzbekistan' })
  address?: string;

  @ApiPropertyOptional({ example: 120.5 })
  overallPrice?: number;

  @ApiPropertyOptional({ example: 'payment-method-uuid' })
  paymentMethodId?: string;

  @ApiPropertyOptional({ example: true })
  withDelivery?: boolean;

  @ApiPropertyOptional({ example: 'Please leave at the gate.' })
  deliveryComment?: string;

  @ApiPropertyOptional({ example: 41.3111 })
  latitude?: number;

  @ApiPropertyOptional({ example: 69.2797 })
  longitude?: number;

  @ApiPropertyOptional({ enum: OrderStatus, example: OrderStatus.pending })
  status?: OrderStatus;

  @ApiPropertyOptional({ enum: PaymentStatus, example: PaymentStatus.pending })
  paymentStatus?: PaymentStatus;

  
}
