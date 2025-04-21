import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContactDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsString()
  email: string;

  @ApiProperty({ example: '+998901234567', required: false })
  @IsOptional()
  @IsString()
  phone_number?: string;

  @ApiProperty({ example: 'Tashkent, Uzbekistan', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'I would like to know more about your tools.' })
  @IsString()
  message: string;
}
