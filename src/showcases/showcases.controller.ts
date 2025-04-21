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
import { ShowcasesService } from './showcases.service';
import { CreateShowcaseDto } from './dto/create-showcase.dto';
import { UpdateShowcaseDto } from './dto/update-showcase.dto';
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

@Roles(Role.User, Role.Admin, Role.SuperAdmin, Role.ViewerAdmin)
@UseGuards(RolesGuard)
@ApiTags('Showcases')
@UseInterceptors(CacheInterceptor)
@Controller('showcases')
export class ShowcasesController {
  constructor(private readonly showcasesService: ShowcasesService) {}

  @Roles(Role.Admin, Role.SuperAdmin)
  @Post()
  @ApiOperation({ summary: 'Create a new showcase' })
  @ApiResponse({ status: 201, description: 'Showcase created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  create(@Body() createShowcaseDto: CreateShowcaseDto) {
    return this.showcasesService.create(createShowcaseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get a list of showcases with optional filters' })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'cursor', required: false })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by name or any description field',
  })
  @ApiQuery({ name: 'orderBy', required: false, example: 'createdAt:desc' })
  @ApiResponse({ status: 200, description: 'List of showcases returned' })
  findAll(
    @Query('skip') skip: number,
    @Query('take') take: number,
    @Query('cursor') cursor: string,
    @Query('search') search: string,
    @Query('orderBy') orderBy: string,
  ) {
    const where: Prisma.ShowcaseWhereInput = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { descriptionUz: { contains: search, mode: 'insensitive' } },
        { descriptionRu: { contains: search, mode: 'insensitive' } },
      ];
    }

    let order: Prisma.ShowcaseOrderByWithRelationInput | undefined = undefined;
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

    const cursorObj: Prisma.ShowcaseWhereUniqueInput | undefined = cursor
      ? { id: String(cursor) }
      : undefined;

    const queryParams = {
      skip,
      take,
      cursor: cursorObj,
      where,
      orderBy: order,
    };

    return this.showcasesService.findAll(queryParams);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a showcase by ID' })
  @ApiResponse({ status: 200, description: 'Showcase found' })
  @ApiResponse({ status: 404, description: 'Showcase not found' })
  findOne(@Param('id') id: string) {
    return this.showcasesService.findOne(id);
  }

  @Roles(Role.Admin, Role.SuperAdmin)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a showcase by ID' })
  @ApiResponse({ status: 200, description: 'Showcase updated successfully' })
  @ApiResponse({ status: 404, description: 'Showcase not found' })
  update(
    @Param('id') id: string,
    @Body() updateShowcaseDto: UpdateShowcaseDto,
  ) {
    return this.showcasesService.update(id, updateShowcaseDto);
  }

  @Roles(Role.Admin, Role.SuperAdmin)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a showcase by ID' })
  @ApiResponse({ status: 200, description: 'Showcase deleted successfully' })
  @ApiResponse({ status: 404, description: 'Showcase not found' })
  remove(@Param('id') id: string) {
    return this.showcasesService.remove(id);
  }
}
