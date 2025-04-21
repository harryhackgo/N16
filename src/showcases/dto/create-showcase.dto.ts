import { IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateShowcaseDto {
  @ApiProperty({ example: 'New Power Tools' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Check out our latest power tools in stock.' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ example: 'Yangi quvvatli asboblar mavjud.' })
  @IsOptional()
  @IsString()
  descriptionUz?: string;

  @ApiPropertyOptional({ example: 'Новые мощные инструменты в наличии.' })
  @IsOptional()
  @IsString()
  descriptionRu?: string;

  @ApiProperty({ example: 'https://cdn.example.com/images/tool-banner.jpg' })
  @IsString()
  image: string;

  @ApiPropertyOptional({ example: 'https://example.com/tools' })
  @IsOptional()
  @IsString()
  link?: string;
}
