import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateProficencyDto {
  @ApiProperty({ example: 'Operator', description: 'Default name (EN)' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Operator (UZ)',
    required: false,
    description: 'Name in Uzbek',
  })
  @IsOptional()
  @IsString()
  nameUz?: string;

  @ApiProperty({
    example: 'Оператор',
    required: false,
    description: 'Name in Russian',
  })
  @IsOptional()
  @IsString()
  nameRu?: string;

  @ApiProperty({
    example: 'df2a1b0e-9c23-4f8d-91f9-b182176a003d',
    required: false,
    description: 'Parent Proficency ID (self-reference)',
  })
  @IsOptional()
  @IsString()
  parentId?: string;
}
