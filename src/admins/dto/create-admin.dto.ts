import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  fullname: string;

  @ApiProperty({ example: 'admin@example.com' })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'StrongPass1!',
    description:
      'Password must include at least 8 characters, one uppercase, one lowercase, one number, and one symbol.',
  })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @IsString()
  password: string;

  @ApiProperty({
    example: true,
    required: false,
    description: 'Indicates if the admin is a super admin.',
  })
  @IsOptional()
  @IsBoolean()
  is_super_admin?: boolean;

  @ApiProperty({
    example: false,
    required: false,
    description: 'Indicates if the admin is a viewer-level admin.',
  })
  @IsOptional()
  @IsBoolean()
  is_viewer_admin?: boolean;
}
