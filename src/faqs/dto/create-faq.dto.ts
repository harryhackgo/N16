import { IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFaqDto {
  @ApiProperty({ example: 'What is your return policy?' })
  @IsString()
  question: string;

  @ApiPropertyOptional({ example: 'Qaytarish siyosati qanday?' })
  @IsOptional()
  @IsString()
  questionUz?: string;

  @ApiPropertyOptional({ example: 'Какая у вас политика возврата?' })
  @IsOptional()
  @IsString()
  questionRu?: string;

  @ApiProperty({ example: 'You can return items within 14 days.' })
  @IsString()
  answer: string;

  @ApiPropertyOptional({ example: '14 kun ichida mahsulotni qaytarishingiz mumkin.' })
  @IsOptional()
  @IsString()
  answerUz?: string;

  @ApiPropertyOptional({ example: 'Вы можете вернуть товар в течение 14 дней.' })
  @IsOptional()
  @IsString()
  answerRu?: string;
}
