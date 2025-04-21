import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderToolDto } from './create-order-tool.dto';

export class UpdateOrderToolDto extends PartialType(CreateOrderToolDto) {}
