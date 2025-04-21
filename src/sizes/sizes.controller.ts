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
import { SizesService } from './sizes.service';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
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
@ApiTags('Sizes')
@UseInterceptors(CacheInterceptor)
@Controller('sizes')
export class SizesController {
  constructor(private readonly sizesService: SizesService) {}

  @Roles(Role.Admin, Role.SuperAdmin)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new size' })
  @ApiResponse({ status: 201, description: 'Size created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  create(@Body() createSizeDto: CreateSizeDto) {
    return this.sizesService.create(createSizeDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a list of sizes with optional filters' })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'cursor', required: false })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by size name',
  })
  @ApiQuery({ name: 'orderBy', required: false, example: 'name:asc' })
  @ApiResponse({ status: 200, description: 'List of sizes returned' })
  findAll(
    @Query('skip') skip: number,
    @Query('take') take: number,
    @Query('cursor') cursor: string,
    @Query('search') search: string,
    @Query('orderBy') orderBy: string,
  ) {
    const where: Prisma.SizeWhereInput = {};
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    let order: Prisma.SizeOrderByWithRelationInput | undefined = undefined;
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

    const cursorObj: Prisma.SizeWhereUniqueInput | undefined = cursor
      ? { id: String(cursor) }
      : undefined;

    const queryParams = {
      skip,
      take,
      cursor: cursorObj,
      where,
      orderBy: order,
    };

    return this.sizesService.findAll(queryParams);
  }

  @Get('name/:name')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get size by name' })
  @ApiParam({ name: 'name', required: true })
  @ApiResponse({ status: 200, description: 'Size found by name' })
  @ApiResponse({ status: 404, description: 'Size not found' })
  findByName(@Param('name') name: string) {
    return this.sizesService.findByName(name);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a size by ID' })
  @ApiResponse({ status: 200, description: 'Size found' })
  @ApiResponse({ status: 404, description: 'Size not found' })
  findOne(@Param('id') id: string) {
    return this.sizesService.findOne(id);
  }

  @Roles(Role.Admin, Role.SuperAdmin)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a size by ID' })
  @ApiResponse({ status: 200, description: 'Size updated successfully' })
  @ApiResponse({ status: 404, description: 'Size not found' })
  update(@Param('id') id: string, @Body() updateSizeDto: UpdateSizeDto) {
    return this.sizesService.update(id, updateSizeDto);
  }

  @Roles(Role.Admin, Role.SuperAdmin)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a size by ID' })
  @ApiResponse({ status: 200, description: 'Size deleted successfully' })
  @ApiResponse({ status: 404, description: 'Size not found' })
  remove(@Param('id') id: string) {
    return this.sizesService.remove(id);
  }
}
