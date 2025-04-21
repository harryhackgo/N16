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
import { ProficienciesService } from './proficencies.service';
import { CreateProficencyDto } from './dto/create-proficency.dto';
import { UpdateProficencyDto } from './dto/update-proficency.dto';
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
@ApiTags('Proficiencies')
@UseInterceptors(CacheInterceptor)
@Controller('proficiencies')
export class ProficienciesController {
  constructor(private readonly proficienciesService: ProficienciesService) {}

  @Roles(Role.Admin, Role.SuperAdmin)
  @Post()
  @ApiOperation({ summary: 'Create a new proficiency' })
  @ApiResponse({ status: 201, description: 'Proficiency created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  create(@Body() createProficencyDto: CreateProficencyDto) {
    return this.proficienciesService.create(createProficencyDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get a list of proficiencies with optional filters',
  })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'cursor', required: false })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by name, nameUz, or nameRu',
  })
  @ApiQuery({ name: 'orderBy', required: false, example: 'name:asc' })
  @ApiResponse({ status: 200, description: 'List of proficiencies returned' })
  findAll(
    @Query('skip') skip: number,
    @Query('take') take: number,
    @Query('cursor') cursor: string,
    @Query('search') search: string,
    @Query('orderBy') orderBy: string,
  ) {
    const where: Prisma.ProficencyWhereInput = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nameUz: { contains: search, mode: 'insensitive' } },
        { nameRu: { contains: search, mode: 'insensitive' } },
      ];
    }

    let order: Prisma.ProficencyOrderByWithRelationInput | undefined =
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

    const cursorObj: Prisma.ProficencyWhereUniqueInput | undefined = cursor
      ? { id: cursor }
      : undefined;

    return this.proficienciesService.findAll({
      skip,
      take,
      cursor: cursorObj,
      where,
      orderBy: order,
    });
  }

  @Get('name/:name')
  @ApiOperation({ summary: 'Get a proficiency by name' })
  @ApiParam({ name: 'name', required: true })
  @ApiResponse({ status: 200, description: 'Proficiency found by name' })
  @ApiResponse({ status: 404, description: 'Proficiency not found' })
  findByName(@Param('name') name: string) {
    return this.proficienciesService.findByName(name);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a proficiency by ID' })
  @ApiParam({ name: 'id', description: 'Proficiency ID' })
  @ApiResponse({ status: 200, description: 'Proficiency found' })
  @ApiResponse({ status: 404, description: 'Proficiency not found' })
  findOne(@Param('id') id: string) {
    return this.proficienciesService.findOne(id);
  }

  @Roles(Role.Admin, Role.SuperAdmin)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a proficiency by ID' })
  @ApiResponse({ status: 200, description: 'Proficiency updated successfully' })
  @ApiResponse({ status: 404, description: 'Proficiency not found' })
  update(
    @Param('id') id: string,
    @Body() updateProficencyDto: UpdateProficencyDto,
  ) {
    return this.proficienciesService.update(id, updateProficencyDto);
  }

  @Roles(Role.Admin, Role.SuperAdmin)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a proficiency by ID' })
  @ApiResponse({ status: 200, description: 'Proficiency deleted successfully' })
  @ApiResponse({ status: 404, description: 'Proficiency not found' })
  remove(@Param('id') id: string) {
    return this.proficienciesService.remove(id);
  }
}
