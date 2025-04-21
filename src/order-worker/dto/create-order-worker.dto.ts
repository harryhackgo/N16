import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { TimeUnit } from '@prisma/client';

export class CreateOrderWorkerDto {
  @ApiProperty({
    description: 'ID of the related order',
    example: '6f3d5c89-2a19-4f42-8c36-24d2ff409e3b',
  })
  @IsUUID()
  orderId: string;

  @ApiProperty({
    description: 'ID of the proficiency the worker should have',
    example: '4a2f5c89-2a19-4f42-8c36-24d2ff409e3b',
  })
  @IsUUID()
  workerProficiencyId: string;

  @ApiProperty({
    description: 'ID of the worker level required',
    example: '9a1d6c21-2b14-4f99-b13d-89cf1fe0234a',
  })
  @IsUUID()
  workerLevelId: string;

  @ApiProperty({
    description: 'Number of workers requested',
    example: 3,
  })
  @IsInt()
  count: number;

  @ApiProperty({
    description: 'Whether the worker(s) should bring tools',
    example: true,
  })
  @IsBoolean()
  withTools: boolean;

  @ApiProperty({
    description: 'Time unit for which the worker is needed',
    enum: TimeUnit,
    example: TimeUnit.hour,
  })
  @IsNotEmpty()
  timeUnit: TimeUnit;

  @ApiProperty({
    description: 'Amount of time required (in selected time unit)',
    example: 5,
  })
  @IsInt()
  time: number;

  @ApiProperty({
    description: 'Total price calculated for this worker request',
    example: 150.0,
  })
  @IsNumber()
  price: number;
}
