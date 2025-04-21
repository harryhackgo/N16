import { PartialType } from '@nestjs/mapped-types';
import { CreateAttachedWorkerDto } from './create-attached-worker.dto';

export class UpdateAttachedWorkerDto extends PartialType(CreateAttachedWorkerDto) {}
