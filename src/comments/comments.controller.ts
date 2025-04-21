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

import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
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
import { GetUser } from '../decorators/get-user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Roles(Role.User, Role.Admin, Role.SuperAdmin, Role.ViewerAdmin)
@UseGuards(RolesGuard)
@ApiTags('Comments')
@UseInterceptors(CacheInterceptor)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Roles(Role.User)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a comment and assign to workers' })
  @ApiResponse({ status: 201, description: 'Comment created with assignments' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  create(@Body() createDto: CreateCommentDto) {
    return this.commentsService.create(createDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a list of comments with optional filters' })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'cursor', required: false })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by orderId or comment message',
  })
  @ApiQuery({ name: 'orderBy', required: false, example: 'createdAt:desc' })
  @ApiResponse({ status: 200, description: 'List of comments returned' })
  findAll(
    @Query('skip') skip: number,
    @Query('take') take: number,
    @Query('cursor') cursor: string,
    @Query('search') search: string,
    @Query('orderBy') orderBy: string,
  ) {
    const where: Prisma.CommentWhereInput = {};
    if (search) {
      where.OR = [
        { orderId: { contains: search } },
        { message: { contains: search, mode: 'insensitive' } },
      ];
    }

    let order: Prisma.CommentOrderByWithRelationInput | undefined = undefined;
    if (orderBy) {
      const [field, direction] = orderBy.split(':');
      if (field && direction && ['asc', 'desc'].includes(direction.toLowerCase())) {
        order = { [field]: direction.toLowerCase() as 'asc' | 'desc' };
      }
    }

    const cursorObj: Prisma.CommentWhereUniqueInput | undefined = cursor
      ? { id: cursor }
      : undefined;

    return this.commentsService.findAll({
      skip,
      take,
      cursor: cursorObj,
      where,
      orderBy: order,
    });
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a comment by ID' })
  @ApiResponse({ status: 200, description: 'Comment found' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }


  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a comment by ID' })
  @ApiResponse({ status: 200, description: 'Comment updated successfully' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  update(@Param('id') id: string, @Body() updateDto: UpdateCommentDto, @GetUser() user: {id: string}) {
    
    return this.commentsService.update(id, updateDto, user);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a comment by ID' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  remove(@Param('id') id: string, @GetUser() user: {id: string}) {
    return this.commentsService.remove(id, user);
  }
}
