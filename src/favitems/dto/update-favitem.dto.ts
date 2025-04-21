import { PartialType } from '@nestjs/mapped-types';
import { CreateFavItemDto } from './create-favitem.dto';

export class UpdateFavItemDto extends PartialType(CreateFavItemDto) {}
