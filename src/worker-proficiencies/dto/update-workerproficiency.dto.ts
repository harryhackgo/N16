import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkerProficiencyDto } from './create-workerproficiency.dto';

export class UpdateWorkerProficiencyDto extends PartialType(CreateWorkerProficiencyDto) {}
