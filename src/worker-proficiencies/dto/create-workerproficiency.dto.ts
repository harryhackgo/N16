import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateWorkerProficiencyDto {
  @ApiProperty({ example: 'worker-uuid' })
  @IsUUID()
  workerId: string;

  @ApiProperty({ example: 'proficiency-uuid' })
  @IsUUID()
  proficencyId: string;
}
