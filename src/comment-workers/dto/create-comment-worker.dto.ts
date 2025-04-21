import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsInt, Min, Max } from 'class-validator';

export class CreateCommentWorkerDto {
  @ApiProperty({
    description: 'Comment ID associated with this entry',
    format: 'uuid',
  })
  @IsUUID()
  commentId: string;

  @ApiProperty({
    description: 'Worker ID being rated',
    format: 'uuid',
  })
  @IsUUID()
  workerId: string;

  @ApiProperty({
    description: 'Star rating given to the worker (1 to 5)',
    minimum: 1,
    maximum: 5,
    example: 4,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  stars: number;
}
