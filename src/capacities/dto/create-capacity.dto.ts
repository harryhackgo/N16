import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCapacityDto {
  @ApiProperty({ example: 'Tool ID of the associated tool' })
  @IsString()
  @IsNotEmpty()
  toolId: string;

  @ApiProperty({ example: '500ml' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
