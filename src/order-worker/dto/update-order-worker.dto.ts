import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderWorkerDto } from './create-order-worker.dto';

export class UpdateOrderWorkerDto extends PartialType(CreateOrderWorkerDto) {}
