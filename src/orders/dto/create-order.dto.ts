import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsDateString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { CreateOrderToolDto } from '../../order-tools/dto/create-order-tool.dto';
import { CreateOrderWorkerDto } from '../../order-worker/dto/create-order-worker.dto';

export class CreateOrderToolWithoutOrderIdDto extends OmitType(CreateOrderToolDto, ['orderId'] as const) {}
export class CreateOrderWorkerWithoutOrderIdDto extends OmitType(CreateOrderWorkerDto, ['orderId'] as const) {}

export class CreateOrderDto {
  @ApiProperty({
    description: 'User ID placing the order',
    example: '92b98215-3f35-4e30-bae2-9cb10fcb77cd',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Order status (pending, confirmed, completed, etc.)',
    enum: OrderStatus,
    example: OrderStatus.pending,
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiProperty({
    description: 'Date and time the order is scheduled for',
    example: '2025-05-10T10:00:00Z',
  })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({
    description: 'Address for the order (optional)',
    example: '123 Example Street, Tashkent',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'Overall price of the entire order',
    example: 500.00,
  })
  @IsNumber()
  overallPrice: number;

  @ApiProperty({
    description: 'Payment method ID',
    example: 'c5d244ff-4561-4724-87b0-f41c9e143f3a',
  })
  @IsString()
  paymentMethodId: string;

  @ApiProperty({
    description: 'Does the order require delivery?',
    example: true,
  })
  @IsBoolean()
  withDelivery: boolean;

  @ApiPropertyOptional({
    description: 'Any specific notes for delivery',
    example: 'Call before arriving',
  })
  @IsOptional()
  @IsString()
  deliveryComment?: string;

  @ApiPropertyOptional({
    description: 'Longitude for map-based delivery',
    example: 69.2401,
  })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({
    description: 'Latitude for map-based delivery',
    example: 41.3111,
  })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({
    description: 'Status of the payment',
    enum: PaymentStatus,
    example: PaymentStatus.pending,
    default: PaymentStatus.pending,
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @ApiPropertyOptional({
    type: [CreateOrderToolWithoutOrderIdDto],
    description: 'List of tools to include in the order',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderToolWithoutOrderIdDto)
  orderTools?: CreateOrderToolWithoutOrderIdDto[];



  @ApiPropertyOptional({
    type: [CreateOrderWorkerWithoutOrderIdDto],
    description: 'List of workers needed for the order',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderWorkerWithoutOrderIdDto)
  orderWorkers?: CreateOrderWorkerWithoutOrderIdDto[];
}
