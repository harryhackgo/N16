import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  fullname: string;

  @ApiProperty({ example: 'johndoe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongPassw0rd!' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: '+998901234567' })
  @IsString()
  phone: string;

  @ApiProperty({
    example: 'johndoe',
    description: 'Unique username for login or display',
  })
  @IsString()
  username: string;

  @ApiProperty({ example: 'Tashkent, Uzbekistan', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'd334b893-8c7e-4931-bc63-bdd27f1e3019', required: false })
  @IsOptional()
  @IsString()
  regionId?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  hasCompany?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
