import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsDateString,
  IsEnum,
  IsNumber,
  IsInt,
  IsUUID,
  Min,
} from 'class-validator';
import { TimeUnit } from '@prisma/client';

export class CreateWorkerDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the worker' })
  @IsString()
  @IsNotEmpty()
  fullname: string;

  @ApiProperty({ example: '+998901234567', description: 'Phone number' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: '1990-05-01T00:00:00.000Z',
    description: 'Birthdate of the worker (ISO 8601)',
  })
  @IsDateString()
  birthdate: string;

  @ApiProperty({
    example: 'Tashkent, Uzbekistan',
    description: 'Worker address',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    enum: TimeUnit,
    description: 'Preferred time unit (e.g., HOUR, DAY)',
  })
  @IsEnum(TimeUnit)
  timeUnit: TimeUnit;

  @ApiPropertyOptional({
    example: 2,
    description: 'Minimum working time in hours/days',
  })
  @IsOptional()
  @IsInt()
  minWorkingTime?: number;

  @ApiPropertyOptional({
    example: 8,
    description: 'Maximum working time in hours/days',
  })
  @IsOptional()
  @IsInt()
  maxWorkingTime?: number;

  @ApiPropertyOptional({
    example: 15.5,
    description: 'Price per hour in currency unit',
  })
  @IsOptional()
  @IsNumber()
  pricePerHour?: number;

  @ApiPropertyOptional({
    example: 100.0,
    description: 'Price per day in currency unit',
  })
  @IsOptional()
  @IsNumber()
  pricePerDay?: number;

  @ApiProperty({
    example: 'f30e443e-bc2d-4d1a-9c5c-52cbbe49b8e3',
    description: 'Level ID (UUID)',
  })
  @IsUUID()
  levelId: string;

  @ApiProperty({ example: 5, description: 'Years of experience' })
  @IsInt()
  @Min(0)
  experience: number;

  @ApiPropertyOptional({
    example: 'Tajribali usta',
    description: 'Bio in Uzbek',
  })
  @IsOptional()
  @IsString()
  aboutUz?: string;

  @ApiPropertyOptional({
    example: 'Опытный мастер',
    description: 'Bio in Russian',
  })
  @IsOptional()
  @IsString()
  aboutRu?: string;

  @ApiProperty({
    example: 'Experienced builder with 5 years of work',
    description: 'Bio in default language',
  })
  @IsString()
  @IsNotEmpty()
  about: string;

  @ApiPropertyOptional({
    example: 'https://cdn.example.com/profile.jpg',
    description: 'Profile image URL or path',
  })
  @IsOptional()
  @IsString()
  profileImage?: string;

  @ApiProperty({
    example: 'https://cdn.example.com/idcard.jpg',
    description: 'ID card image URL or path',
  })
  @IsString()
  @IsNotEmpty()
  idcardImage: string;

  @ApiPropertyOptional({ example: false, description: 'Verification status' })
  @IsOptional()
  isVerified?: boolean;
}
