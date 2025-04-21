import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserActivationDto {

  @ApiProperty({ example: '+998901234567', description: 'Phone number in international format' })
  @IsPhoneNumber('UZ')
  phone: string;

  @ApiProperty({ example: '123456', description: 'Your otp that you recieved through sms' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(6)
  otp: string
}
