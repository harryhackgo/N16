import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentWorkerDto } from './create-comment-worker.dto';

export class UpdateCommentWorkerDto extends PartialType(CreateCommentWorkerDto) {}
