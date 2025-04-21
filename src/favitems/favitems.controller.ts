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
import { FavItemsService } from './favitems.service';
import { CreateFavItemDto } from './dto/create-favitem.dto';
import { UpdateFavItemDto } from './dto/update-favitem.dto';
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

@Roles(Role.User, Role.SuperAdmin, Role.ViewerAdmin)
@UseGuards(RolesGuard)
@ApiTags('FavItems')
@UseInterceptors(CacheInterceptor)
@Controller('favitems')
export class FavItemsController {
  constructor(private readonly favItemsService: FavItemsService) {}

  @Roles(Role.User)
  @Post()
  @ApiOperation({ summary: 'Create a new favorite item' })
  @ApiResponse({ status: 201, description: 'FavItem created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  create(@Body() createFavItemDto: CreateFavItemDto) {
    return this.favItemsService.create(createFavItemDto);
  }


  @Get()
  @ApiOperation({ summary: 'Get a list of FavItems with optional filters' })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'cursor', required: false })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by toolId or workerId',
  })
  @ApiQuery({ name: 'orderBy', required: false, example: 'createdAt:desc' })
  @ApiResponse({ status: 200, description: 'List of FavItems returned' })
  findAll(
    @Query('skip') skip: number,
    @Query('take') take: number,
    @Query('cursor') cursor: string,
    @Query('search') search: string,
    @Query('orderBy') orderBy: string,
  ) {
    const where: Prisma.FavItemsWhereInput = {};
    if (search) {
      where.OR = [
        { toolId: { contains: search, mode: 'insensitive' } },
        { workerId: { contains: search, mode: 'insensitive' } },
      ];
    }

    let order: Prisma.FavItemsOrderByWithRelationInput | undefined = undefined;
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

    const cursorObj: Prisma.FavItemsWhereUniqueInput | undefined = cursor
      ? { id: String(cursor) }
      : undefined;

    const queryParams = {
      skip,
      take,
      cursor: cursorObj,
      where,
      orderBy: order,
    };

    return this.favItemsService.findAll(queryParams);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a FavItem by ID' })
  @ApiResponse({ status: 200, description: 'FavItem found' })
  @ApiResponse({ status: 404, description: 'FavItem not found' })
  findOne(@Param('id') id: string) {
    return this.favItemsService.findOne(id);
  }

  @Roles(Role.User, Role.SuperAdmin)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a FavItem by ID' })
  @ApiResponse({ status: 200, description: 'FavItem updated successfully' })
  @ApiResponse({ status: 404, description: 'FavItem not found' })
  update(@Param('id') id: string, @Body() updateFavItemDto: UpdateFavItemDto) {
    return this.favItemsService.update(id, updateFavItemDto);
  }

  @Roles(Role.User, Role.SuperAdmin)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a FavItem by ID' })
  @ApiResponse({ status: 200, description: 'FavItem deleted successfully' })
  @ApiResponse({ status: 404, description: 'FavItem not found' })
  remove(@Param('id') id: string) {
    return this.favItemsService.remove(id);
  }
}
