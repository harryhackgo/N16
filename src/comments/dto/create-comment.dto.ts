import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsUUID,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCommentWorkerDto } from '../../comment-workers/dto/create-comment-worker.dto';

export class CreateCommentDto {
  @ApiProperty({ description: 'Order ID this comment is linked to', format: 'uuid' })
  @IsUUID()
  orderId: string;

  @ApiProperty({ description: 'Optional comment message', required: false })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({
    description: 'Array of workers and stars rated in this comment',
    type: [CreateCommentWorkerDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCommentWorkerDto)
  commentWorkers: CreateCommentWorkerDto[];
}
