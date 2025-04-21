import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGeneralDto {
  @ApiProperty({
    example: 'This is some general information about the company',
    required: false,
  })
  @IsOptional()
  @IsString()
  info?: string;

  @ApiProperty({
    example: 'general@example.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({
    example: '+998901234567',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;
}
