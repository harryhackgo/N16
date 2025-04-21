import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSizeDto {
  @ApiProperty({
    example: 'Large',
    description: 'The name of the size',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: '8f58e8b9-1c4c-4f45-b67f-90d5df76d889',
    description: 'The ID of the tool this size belongs to',
  })
  @IsString()
  toolId: string;
}
