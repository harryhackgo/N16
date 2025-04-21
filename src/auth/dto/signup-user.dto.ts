import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SignupUserDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsString()
  @IsNotEmpty()
  fullname: string;

  @ApiProperty({ example: 'johndoe@example.com', description: 'Unique email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'secretPassword123', minLength: 6, description: 'Secure password' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: '+998901234567', description: 'Phone number in international format' })
  @IsPhoneNumber('UZ')
  phone: string;

  @ApiPropertyOptional({ example: 'Tashkent, Uzbekistan', description: 'Home address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'johndoe', description: 'Unique username' })
  @IsString()
  username: string;

  @ApiPropertyOptional({ example: '7df94b29-1234-4cc6-b97d-9812571721f1', description: 'Region ID (optional)' })
  @IsOptional()
  @IsString()
  regionId?: string;
}
