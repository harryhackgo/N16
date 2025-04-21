import {
  IsPhoneNumber
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResendOtpDto {

  @ApiProperty({ example: '+998901234567', description: 'Phone number in international format' })
  @IsPhoneNumber('UZ')
  phone: string;
}
