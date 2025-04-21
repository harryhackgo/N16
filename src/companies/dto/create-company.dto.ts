import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 'Tech Corp' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Innovatsion texnologiyalar kompaniyasi' })
  @IsOptional()
  @IsString()
  aboutUz?: string;

  @ApiPropertyOptional({ example: 'Инновационная технологическая компания' })
  @IsOptional()
  @IsString()
  aboutRu?: string;

  @ApiPropertyOptional({ example: 'An innovative tech company.' })
  @IsOptional()
  @IsString()
  about?: string;

  @ApiProperty({ example: 'info@techcorp.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+998901234567' })
  @IsString()
  phone: string;

  @ApiProperty({ example: '123 Main St, Tashkent' })
  @IsString()
  address: string;

  @ApiPropertyOptional({ example: 'https://techcorp.com' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}
