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
import { CommentWorkersService } from './comment-workers.service';
import { CreateCommentWorkerDto } from './dto/create-comment-worker.dto';
import { UpdateCommentWorkerDto } from './dto/update-comment-worker.dto';
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
import { GetUser } from '../decorators/get-user.decorator';

@Roles(Role.User, Role.Admin, Role.SuperAdmin, Role.ViewerAdmin)
@UseGuards(RolesGuard)
@ApiTags('CommentWorkers')
@UseInterceptors(CacheInterceptor)
@Controller('comment-workers')
export class CommentWorkersController {
  constructor(private readonly commentWorkersService: CommentWorkersService) {}

  @Roles(Role.User)
  @Post()
  @ApiOperation({ summary: 'Create a new comment for a worker' })
  @ApiResponse({ status: 201, description: 'CommentWorker created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  create(@Body() createDto: CreateCommentWorkerDto) {
    return this.commentWorkersService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get a list of CommentWorkers with optional filters' })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'cursor', required: false })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by commentId or workerId',
  })
  @ApiQuery({ name: 'orderBy', required: false, example: 'createdAt:desc' })
  @ApiResponse({ status: 200, description: 'List of CommentWorkers returned' })
  findAll(
    @Query('skip') skip: number,
    @Query('take') take: number,
    @Query('cursor') cursor: string,
    @Query('search') search: string,
    @Query('orderBy') orderBy: string,
  ) {
    const where: Prisma.CommentWorkerWhereInput = {};
    if (search) {
      where.OR = [
        { commentId: { contains: search } },
        { workerId: { contains: search } },
      ];
    }

    let order: Prisma.CommentWorkerOrderByWithRelationInput | undefined =
      undefined;
    if (orderBy) {
      const [field, direction] = orderBy.split(':');
      if (
        field &&
        direction &&
        ['asc', 'desc'].includes(direction.toLowerCase())
      ) {
        order = { [field]: direction.toLowerCase() as 'asc' | 'desc' };
      }
    }

    const cursorObj: Prisma.CommentWorkerWhereUniqueInput | undefined = cursor
      ? { id: String(cursor) }
      : undefined;

    return this.commentWorkersService.findAll({
      skip,
      take,
      cursor: cursorObj,
      where,
      orderBy: order,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a CommentWorker by ID' })
  @ApiResponse({ status: 200, description: 'CommentWorker found' })
  @ApiResponse({ status: 404, description: 'CommentWorker not found' })
  findOne(@Param('id') id: string) {
    return this.commentWorkersService.findOne(id);
  }

  @Roles(Role.User)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a CommentWorker by ID' })
  @ApiResponse({ status: 200, description: 'CommentWorker updated successfully' })
  @ApiResponse({ status: 404, description: 'CommentWorker not found' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateCommentWorkerDto,
    @GetUser() user: {id: string}
  ) {
    return this.commentWorkersService.update(id, updateDto, user);
  }

  @Roles(Role.User)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a CommentWorker by ID' })
  @ApiResponse({ status: 200, description: 'CommentWorker deleted successfully' })
  @ApiResponse({ status: 404, description: 'CommentWorker not found' })
  remove(@Param('id') id: string, @GetUser() user: {id: string}) {
    return this.commentWorkersService.remove(id, user);
  }
}
