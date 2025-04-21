import { IsUUID, IsInt, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderToolDto {
  @ApiProperty({ description: 'Order ID', format: 'uuid' })
  @IsUUID()
  orderId: string;

  @ApiProperty({ description: 'Tool ID', format: 'uuid' })
  @IsUUID()
  toolId: string;

  @ApiProperty({ description: 'Count of tools ordered', example: 1 })
  @IsInt()
  @Min(1)
  count: number;

  @ApiProperty({ description: 'Price per tool', example: 49.99 })
  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;
}
