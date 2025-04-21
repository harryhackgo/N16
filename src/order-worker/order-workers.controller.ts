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
import { OrderWorkersService } from './order-workers.service';
import { CreateOrderWorkerDto } from './dto/create-order-worker.dto';
import { UpdateOrderWorkerDto } from './dto/update-order-worker.dto';
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

@Roles(Role.User, Role.Admin, Role.SuperAdmin, Role.ViewerAdmin)
@UseGuards(RolesGuard)
@ApiTags('OrderWorkers')
@UseInterceptors(CacheInterceptor)
@Controller('order-workers')
export class OrderWorkersController {
  constructor(private readonly orderWorkersService: OrderWorkersService) {}

  @Roles(Role.User)
  @Post()
  @ApiOperation({ summary: 'Create a new OrderWorker entry' })
  @ApiResponse({ status: 201, description: 'OrderWorker created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  create(@Body() createDto: CreateOrderWorkerDto) {
    return this.orderWorkersService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get a list of OrderWorkers with optional filters' })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'cursor', required: false })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by orderId or proficiencyId',
  })
  @ApiQuery({ name: 'orderBy', required: false, example: 'createdAt:desc' })
  @ApiResponse({ status: 200, description: 'List of OrderWorkers returned' })
  findAll(
    @Query('skip') skip: number,
    @Query('take') take: number,
    @Query('cursor') cursor: string,
    @Query('search') search: string,
    @Query('orderBy') orderBy: string,
  ) {
    const where: Prisma.OrderWorkerWhereInput = {};
    if (search) {
      where.OR = [
        { orderId: { contains: search } },
        { workerProficiencyId: { contains: search } },
      ];
    }

    let order: Prisma.OrderWorkerOrderByWithRelationInput | undefined = undefined;
    if (orderBy) {
      const [field, direction] = orderBy.split(':');
      if (field && direction && ['asc', 'desc'].includes(direction.toLowerCase())) {
        order = { [field]: direction.toLowerCase() as 'asc' | 'desc' };
      }
    }

    const cursorObj: Prisma.OrderWorkerWhereUniqueInput | undefined = cursor
      ? { id: cursor }
      : undefined;

    return this.orderWorkersService.findAll({
      skip,
      take,
      cursor: cursorObj,
      where,
      orderBy: order,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an OrderWorker by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, description: 'OrderWorker found' })
  @ApiResponse({ status: 404, description: 'OrderWorker not found' })
  findOne(@Param('id') id: string) {
    return this.orderWorkersService.findOne(id);
  }

  @Roles(Role.User, Role.Admin, Role.SuperAdmin)
  @Patch(':id')
  @ApiOperation({ summary: 'Update an OrderWorker by ID' })
  @ApiResponse({ status: 200, description: 'OrderWorker updated successfully' })
  @ApiResponse({ status: 404, description: 'OrderWorker not found' })
  update(@Param('id') id: string, @Body() updateDto: UpdateOrderWorkerDto) {
    return this.orderWorkersService.update(id, updateDto);
  }

  @Roles(Role.User, Role.Admin, Role.SuperAdmin)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an OrderWorker by ID' })
  @ApiResponse({ status: 200, description: 'OrderWorker deleted successfully' })
  @ApiResponse({ status: 404, description: 'OrderWorker not found' })
  remove(@Param('id') id: string) {
    return this.orderWorkersService.remove(id);
  }
}
