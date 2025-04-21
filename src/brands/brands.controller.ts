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
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
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
@ApiTags('Brands')
@UseInterceptors(CacheInterceptor)
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new brand' })
  @ApiResponse({ status: 201, description: 'Brand created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }

  @Roles(Role.User, Role.Admin, Role.SuperAdmin, Role.ViewerAdmin)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a list of brands with optional filters' })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'cursor', required: false })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by brand name',
  })
  @ApiQuery({ name: 'orderBy', required: false, example: 'name:asc' })
  @ApiResponse({ status: 200, description: 'List of brands returned' })
  findAll(
    @Query('skip') skip: number,
    @Query('take') take: number,
    @Query('cursor') cursor: string,
    @Query('search') search: string,
    @Query('orderBy') orderBy: string,
  ) {
    const where: Prisma.BrandWhereInput = {};
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    let order: Prisma.BrandOrderByWithRelationInput | undefined = undefined;
    if (orderBy) {
      const [field, direction] = orderBy.split(':');
      if (field && direction && ['asc', 'desc'].includes(direction.toLowerCase())) {
        order = { [field]: direction.toLowerCase() as 'asc' | 'desc' };
      }
    }

    const cursorObj: Prisma.BrandWhereUniqueInput | undefined = cursor
      ? { id: cursor }
      : undefined;

    return this.brandsService.findAll({
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
  @ApiOperation({ summary: 'Get brand by name' })
  @ApiParam({ name: 'name', required: true })
  @ApiResponse({ status: 200, description: 'Brand found by name' })
  @ApiResponse({ status: 404, description: 'Brand not found' })
  findByName(@Param('name') name: string) {
    return this.brandsService.findByName(name);
  }

  @Roles(Role.User, Role.Admin, Role.SuperAdmin, Role.ViewerAdmin)
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a brand by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, description: 'Brand found' })
  @ApiResponse({ status: 404, description: 'Brand not found' })
  findOne(@Param('id') id: string) {
    return this.brandsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a brand by ID' })
  @ApiResponse({ status: 200, description: 'Brand updated successfully' })
  @ApiResponse({ status: 404, description: 'Brand not found' })
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandsService.update(id, updateBrandDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a brand by ID' })
  @ApiResponse({ status: 200, description: 'Brand deleted successfully' })
  @ApiResponse({ status: 404, description: 'Brand not found' })
  remove(@Param('id') id: string) {
    return this.brandsService.remove(id);
  }
}
