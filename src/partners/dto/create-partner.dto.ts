import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePartnerDto {
  @ApiProperty({ example: 'Microsoft' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'https://cdn.com/microsoft.png' })
  @IsString()
  image: string;

  @ApiProperty({
    example: 'https://microsoft.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  link?: string;
}
