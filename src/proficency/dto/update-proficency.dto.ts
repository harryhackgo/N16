import { PartialType } from '@nestjs/mapped-types';
import { CreateProficencyDto } from './create-proficency.dto';

export class UpdateProficencyDto extends PartialType(CreateProficencyDto) {}
