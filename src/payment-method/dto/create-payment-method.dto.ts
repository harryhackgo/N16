import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePaymentMethodDto {
  @ApiProperty({ example: 'Payme', description: 'Name of the payment method' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Fast online payment system',
    description: 'Optional description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
