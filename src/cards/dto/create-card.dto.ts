import { IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCardDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  userId: string;

  @ApiProperty({ example: '8600123456789012' })
  @IsString()
  @Matches(/^\d{16}$/, { message: 'Card number must be exactly 16 digits' })
  card_number: string;

  @ApiProperty({ example: '12/26' })
  @IsString()
  @Matches(/^(0[1-9]|1[0-2])\/\d{2}$/, {
    message: 'Due date must be in MM/YY format',
  })
  due_date: string;
}
