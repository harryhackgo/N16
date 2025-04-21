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
import { OrderToolsService } from './order-tools.service';
import { CreateOrderToolDto } from './dto/create-order-tool.dto';
import { UpdateOrderToolDto } from './dto/update-order-tool.dto';
import { Prisma } from '@prisma/client';
import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';

import { Role } from '../enums/role.enum';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Roles(Role.User, Role.Admin, Role.SuperAdmin, Role.ViewerAdmin)
@UseGuards(RolesGuard)
@ApiTags('OrderTools')
@UseInterceptors(CacheInterceptor)
@Controller('order-tools')
export class OrderToolsController {
  constructor(private readonly orderToolsService: OrderToolsService) {}

  @Roles(Role.User)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new OrderTool record' })
  @ApiResponse({ status: 201, description: 'OrderTool created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  create(@Body() createDto: CreateOrderToolDto) {
    return this.orderToolsService.create(createDto);
  }


  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get a list of OrderTools with optional filters',
  })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'cursor', required: false })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by toolId or orderId',
  })
  @ApiQuery({ name: 'orderBy', required: false, example: 'createdAt:desc' })
  @ApiResponse({ status: 200, description: 'List of OrderTools returned' })
  findAll(
    @Query('skip') skip: number,
    @Query('take') take: number,
    @Query('cursor') cursor: string,
    @Query('search') search: string,
    @Query('orderBy') orderBy: string,
  ) {
    const where: Prisma.OrderToolWhereInput = {};
    if (search) {
      where.OR = [
        { toolId: { contains: search } },
        { orderId: { contains: search } },
      ];
    }

    let order: Prisma.OrderToolOrderByWithRelationInput | undefined =
      undefined;
    if (orderBy) {
      const [field, direction] = orderBy.split(':');
      if (field && direction && ['asc', 'desc'].includes(direction.toLowerCase())) {
        order = { [field]: direction.toLowerCase() as 'asc' | 'desc' };
      }
    }

    const cursorObj: Prisma.OrderToolWhereUniqueInput | undefined = cursor
      ? { id: String(cursor) }
      : undefined;

    return this.orderToolsService.findAll({
      skip,
      take,
      cursor: cursorObj,
      where,
      orderBy: order,
    });
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get an OrderTool by ID' })
  @ApiResponse({ status: 200, description: 'OrderTool found' })
  @ApiResponse({ status: 404, description: 'OrderTool not found' })
  findOne(@Param('id') id: string) {
    return this.orderToolsService.findOne(id);
  }

  @Roles(Role.User, Role.Admin, Role.SuperAdmin)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an OrderTool by ID' })
  @ApiResponse({ status: 200, description: 'OrderTool updated successfully' })
  @ApiResponse({ status: 404, description: 'OrderTool not found' })
  update(@Param('id') id: string, @Body() updateDto: UpdateOrderToolDto) {
    return this.orderToolsService.update(id, updateDto);
  }

  @Roles( Role.Admin, Role.SuperAdmin)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an OrderTool by ID' })
  @ApiResponse({ status: 200, description: 'OrderTool deleted successfully' })
  @ApiResponse({ status: 404, description: 'OrderTool not found' })
  remove(@Param('id') id: string) {
    return this.orderToolsService.remove(id);
  }
}
