import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsUUID,
  IsPositive,
  Min,
} from 'class-validator';

export class CreateToolDto {
  @ApiProperty({ example: 'Cordless Drill' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'uuid-of-brand' })
  @IsOptional()
  @IsUUID()
  brandId?: string;

  @ApiProperty({ example: 149.99 })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ example: 25 })
  @IsNumber()
  @Min(0)
  inStockCount: number;

  @ApiPropertyOptional({ example: 'Bu matkap oson foydalaniladi' })
  @IsOptional()
  @IsString()
  descriptionUz?: string;

  @ApiPropertyOptional({ example: 'Эта дрель удобна в использовании' })
  @IsOptional()
  @IsString()
  descriptionRu?: string;

  @ApiPropertyOptional({ example: 'This drill is easy to use.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  bookable?: boolean;

  @ApiPropertyOptional({ example: '/images/tools/drill.jpg' })
  @IsOptional()
  @IsString()
  imagePath?: string;
}
