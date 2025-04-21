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
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { Prisma } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';

import { Role } from '../enums/role.enum';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Roles(Role.User, Role.SuperAdmin, Role.ViewerAdmin)
@UseGuards(RolesGuard)
@ApiTags('Favorites')
@UseInterceptors(CacheInterceptor)
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Roles(Role.User)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new Favorite' })
  @ApiResponse({ status: 201, description: 'Favorite created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input or already exists' })
  create(@Body() createFavoriteDto: CreateFavoriteDto) {
    return this.favoritesService.create(createFavoriteDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all Favorites with filters' })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'cursor', required: false })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by userId or itemId',
  })
  @ApiQuery({ name: 'orderBy', required: false, example: 'createdAt:desc' })
  @ApiResponse({ status: 200, description: 'List of favorites' })
  findAll(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('cursor') cursor?: string,
    @Query('search') search?: string,
    @Query('orderBy') orderBy?: string,
  ) {
    const where: Prisma.FavoritesWhereInput = {};
    if (search) {
      where.OR = [
        { userId: { contains: search, mode: 'insensitive' } },
        { itemId: { contains: search, mode: 'insensitive' } },
      ];
    }

    let order: Prisma.FavoritesOrderByWithRelationInput | undefined = undefined;
    if (orderBy) {
      const [field, direction] = orderBy.split(':');
      order = { [field]: direction.toLowerCase() as 'asc' | 'desc' };
    }

    const cursorObj: Prisma.FavoritesWhereUniqueInput | undefined = cursor
      ? { id: cursor }
      : undefined;

    const queryParams = {
      skip,
      take,
      cursor: cursorObj,
      where,
      orderBy: order,
    };

    return this.favoritesService.findAll(queryParams);
  }

  
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a Favorite by ID' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Favorite found' })
  @ApiResponse({ status: 404, description: 'Favorite not found' })
  findOne(@Param('id') id: string) {
    return this.favoritesService.findOne(id);
  }

  @Roles(Role.User, Role.SuperAdmin)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a Favorite by ID' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Favorite updated successfully' })
  @ApiResponse({ status: 404, description: 'Favorite not found' })
  update(@Param('id') id: string, @Body() updateDto: UpdateFavoriteDto) {
    return this.favoritesService.update(id, updateDto);
  }

  @Roles(Role.User, Role.SuperAdmin)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a Favorite by ID' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Favorite deleted successfully' })
  @ApiResponse({ status: 404, description: 'Favorite not found' })
  remove(@Param('id') id: string) {
    return this.favoritesService.remove(id);
  }
}
