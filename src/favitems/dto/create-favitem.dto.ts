import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TimeUnit } from '@prisma/client';

export class CreateFavItemDto {
  @ApiPropertyOptional({ example: 'uuid-of-tool' })
  @IsOptional()
  @IsString()
  toolId?: string;

  @ApiPropertyOptional({ example: 'uuid-of-worker' })
  @IsOptional()
  @IsString()
  workerId?: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  count: number;

  @ApiProperty({ example: 'hour', enum: TimeUnit })
  @IsEnum(TimeUnit)
  timeUnit: TimeUnit;

  @ApiProperty({ example: 2 })
  @IsNumber()
  time: number;

  @ApiProperty({ example: 100.0 })
  @IsNumber()
  price: number;
}
