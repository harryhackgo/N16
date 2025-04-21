import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLevelDto {
  @ApiProperty({ example: 'Expert' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
