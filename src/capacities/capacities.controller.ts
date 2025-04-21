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
import { CapacitiesService } from './capacities.service';
import { CreateCapacityDto } from './dto/create-capacity.dto';
import { UpdateCapacityDto } from './dto/update-capacity.dto';
import { Prisma } from '@prisma/client';
import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { RolesGuard } from '../guards/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Roles(Role.Admin, Role.SuperAdmin)
@UseGuards(RolesGuard)
@ApiTags('Capacities')
@UseInterceptors(CacheInterceptor)
@Controller('capacities')
export class CapacitiesController {
  constructor(private readonly capacitiesService: CapacitiesService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new capacity' })
  @ApiResponse({ status: 201, description: 'Capacity created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  create(@Body() createCapacityDto: CreateCapacityDto) {
    return this.capacitiesService.create(createCapacityDto);
  }

  @Roles(Role.User, Role.Admin, Role.SuperAdmin, Role.ViewerAdmin)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a list of capacities with optional filters' })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'cursor', required: false })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by capacity name',
  })
  @ApiQuery({ name: 'orderBy', required: false, example: 'name:asc' })
  @ApiResponse({ status: 200, description: 'List of capacities returned' })
  findAll(
    @Query('skip') skip: number,
    @Query('take') take: number,
    @Query('cursor') cursor: string,
    @Query('search') search: string,
    @Query('orderBy') orderBy: string,
  ) {
    const where: Prisma.CapacityWhereInput = {};
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    let order: Prisma.CapacityOrderByWithRelationInput | undefined = undefined;
    if (orderBy) {
      const [field, direction] = orderBy.split(':');
      if (field && direction && ['asc', 'desc'].includes(direction.toLowerCase())) {
        order = { [field]: direction.toLowerCase() as 'asc' | 'desc' };
      }
    }

    const cursorObj: Prisma.CapacityWhereUniqueInput | undefined = cursor
      ? { id: cursor }
      : undefined;

    return this.capacitiesService.findAll({
      skip,
      take,
      cursor: cursorObj,
      where,
      orderBy: order,
    });
  }

  @Roles(Role.User, Role.Admin, Role.SuperAdmin, Role.ViewerAdmin)
  @Get('name/:name')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get capacity by name' })
  @ApiParam({ name: 'name', required: true })
  @ApiResponse({ status: 200, description: 'Capacity found by name' })
  @ApiResponse({ status: 404, description: 'Capacity not found' })
  findByName(@Param('name') name: string) {
    return this.capacitiesService.findByName(name);
  }

  @Roles(Role.User, Role.Admin, Role.SuperAdmin, Role.ViewerAdmin)
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a capacity by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, description: 'Capacity found' })
  @ApiResponse({ status: 404, description: 'Capacity not found' })
  findOne(@Param('id') id: string) {
    return this.capacitiesService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a capacity by ID' })
  @ApiResponse({ status: 200, description: 'Capacity updated successfully' })
  @ApiResponse({ status: 404, description: 'Capacity not found' })
  update(@Param('id') id: string, @Body() updateCapacityDto: UpdateCapacityDto) {
    return this.capacitiesService.update(id, updateCapacityDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a capacity by ID' })
  @ApiResponse({ status: 200, description: 'Capacity deleted successfully' })
  @ApiResponse({ status: 404, description: 'Capacity not found' })
  remove(@Param('id') id: string) {
    return this.capacitiesService.remove(id);
  }
}
