import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { AttachedWorkersService } from './attached-workers.service';
import { CreateAttachedWorkerDto } from './dto/create-attached-worker.dto';
import { UpdateAttachedWorkerDto } from './dto/update-attached-worker.dto';
import { Prisma } from '@prisma/client';
import {
  ApiTags,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { RolesGuard } from '../guards/roles.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Roles(Role.Admin, Role.SuperAdmin)
@UseGuards(RolesGuard)
@ApiTags('AttachedWorkers')
@UseInterceptors(CacheInterceptor)
@Controller('attached-workers')
export class AttachedWorkersController {
  constructor(
    private readonly attachedWorkersService: AttachedWorkersService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Attach a worker to an OrderWorker' })
  @ApiResponse({
    status: 201,
    description: 'AttachedWorker created successfully',
  })
  create(@Body() createDto: CreateAttachedWorkerDto) {
    return this.attachedWorkersService.create(createDto);
  }

  @Roles(Role.User, Role.Admin, Role.SuperAdmin, Role.ViewerAdmin)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get list of attached workers with optional filters',
  })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'cursor', required: false })
  @ApiQuery({ name: 'orderBy', required: false, example: 'createdAt:desc' })
  @ApiResponse({
    status: 200,
    description: 'List of attached workers returned',
  })
  findAll(
    @Query('skip') skip: number,
    @Query('take') take: number,
    @Query('cursor') cursor: string,
    @Query('orderBy') orderBy: string,
  ) {
    let order: Prisma.AttachedWorkerOrderByWithRelationInput | undefined;
    if (orderBy) {
      const [field, direction] = orderBy.split(':');
      if (['asc', 'desc'].includes(direction.toLowerCase())) {
        order = { [field]: direction.toLowerCase() as 'asc' | 'desc' };
      }
    }

    const cursorObj: Prisma.AttachedWorkerWhereUniqueInput | undefined = cursor
      ? { id: cursor }
      : undefined;

    return this.attachedWorkersService.findAll({
      skip,
      take,
      cursor: cursorObj,
      orderBy: order,
    });
  }

  @Roles(Role.User, Role.Admin, Role.SuperAdmin, Role.ViewerAdmin)
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get an attached worker by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, description: 'Attached worker found' })
  @ApiResponse({ status: 404, description: 'Attached worker not found' })
  findOne(@Param('id') id: string) {
    return this.attachedWorkersService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an attached worker by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({
    status: 200,
    description: 'Attached worker updated successfully',
  })
  update(@Param('id') id: string, @Body() updateDto: UpdateAttachedWorkerDto) {
    return this.attachedWorkersService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove an attached worker by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({
    status: 200,
    description: 'Attached worker deleted successfully',
  })
  remove(@Param('id') id: string) {
    return this.attachedWorkersService.remove(id);
  }
}
