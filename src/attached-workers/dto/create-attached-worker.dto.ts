import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateAttachedWorkerDto {
  @ApiProperty({ example: 'order-worker-id', description: 'ID of the orderWorker' })
  @IsUUID()
  orderWorkerId: string;

  @ApiProperty({ example: 'worker-id', description: 'ID of the worker' })
  @IsUUID()
  workerId: string;
}
