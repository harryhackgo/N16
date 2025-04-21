import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateFavItemDto } from '../../favitems/dto/create-favitem.dto';

export class CreateFavoriteDto {
  @ApiProperty({ example: 'uuid-of-user' })
  @IsString()
  userId: string;

  @ApiPropertyOptional({ example: 'uuid-of-existing-favitem' })
  @IsOptional()
  @IsString()
  itemId?: string;

  @ApiPropertyOptional({ type: CreateFavItemDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateFavItemDto)
  favItem?: CreateFavItemDto;
}
