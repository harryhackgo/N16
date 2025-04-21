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
import { WorkerProficienciesService } from './workerproficiencies.service';
import { CreateWorkerProficiencyDto } from './dto/create-workerproficiency.dto';
import { UpdateWorkerProficiencyDto } from './dto/update-workerproficiency.dto';
import { Prisma } from '@prisma/client';
import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

import { Role } from '../enums/role.enum';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Roles(Role.User, Role.Admin, Role.SuperAdmin, Role.ViewerAdmin)
@UseGuards(RolesGuard)
@ApiTags('Worker Proficiencies')
@UseInterceptors(CacheInterceptor)
@Controller('workerproficiencies')
export class WorkerProficienciesController {
  constructor(private readonly service: WorkerProficienciesService) {}

  
  @Roles(Role.Admin, Role.SuperAdmin)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new worker proficiency link' })
  @ApiResponse({ status: 201, description: 'WorkerProficiency created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  create(@Body() dto: CreateWorkerProficiencyDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a list of worker proficiencies with optional filters' })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'cursor', required: false })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by workerId or proficencyId',
  })
  @ApiQuery({ name: 'orderBy', required: false, example: 'createdAt:desc' })
  @ApiResponse({ status: 200, description: 'List of worker proficiencies returned' })
  findAll(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('cursor') cursor?: string,
    @Query('search') search?: string,
    @Query('orderBy') orderBy?: string,
  ) {
    const where: Prisma.WorkerProficiencyWhereInput = {};
    if (search) {
      where.OR = [
        { workerId: { contains: search, mode: 'insensitive' } },
        { proficencyId: { contains: search, mode: 'insensitive' } },
      ];
    }

    let order: Prisma.WorkerProficiencyOrderByWithRelationInput | undefined =
      undefined;
    if (orderBy) {
      const [field, direction] = orderBy.split(':');
      if (field && ['asc', 'desc'].includes(direction?.toLowerCase())) {
        order = { [field]: direction.toLowerCase() as 'asc' | 'desc' };
      }
    }

    const cursorObj: Prisma.WorkerProficiencyWhereUniqueInput | undefined =
      cursor ? { id: cursor } : undefined;

    return this.service.findAll({
      skip,
      take,
      cursor: cursorObj,
      where,
      orderBy: order,
    });
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a worker proficiency by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, description: 'WorkerProficiency found' })
  @ApiResponse({ status: 404, description: 'WorkerProficiency not found' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Roles(Role.Admin, Role.SuperAdmin)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a worker proficiency by ID' })
  @ApiResponse({ status: 200, description: 'WorkerProficiency updated successfully' })
  @ApiResponse({ status: 404, description: 'WorkerProficiency not found' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateWorkerProficiencyDto,
  ) {
    return this.service.update(id, dto);
  }

  @Roles(Role.Admin, Role.SuperAdmin)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a worker proficiency by ID' })
  @ApiResponse({ status: 200, description: 'WorkerProficiency deleted successfully' })
  @ApiResponse({ status: 404, description: 'WorkerProficiency not found' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
