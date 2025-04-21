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
import { GeneralsService } from './generals.service';
import { CreateGeneralDto } from './dto/create-general.dto';
import { UpdateGeneralDto } from './dto/update-general.dto';
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

@Roles(Role.Admin, Role.SuperAdmin, Role.ViewerAdmin, Role.User)

@UseGuards(RolesGuard)
@ApiTags('Generals')
@UseInterceptors(CacheInterceptor)
@Controller('generals')
export class GeneralsController {
  constructor(private readonly generalsService: GeneralsService) {}

  @Roles(Role.Admin, Role.SuperAdmin)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create general information' })
  @ApiResponse({ status: 201, description: 'General info created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  create(@Body() createGeneralDto: CreateGeneralDto) {
    return this.generalsService.create(createGeneralDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all general records with optional filters' })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'cursor', required: false })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by info, email, or phone',
  })
  @ApiQuery({ name: 'orderBy', required: false, example: 'email:asc' })
  @ApiResponse({ status: 200, description: 'List of general records' })
  findAll(
    @Query('skip') skip: number,
    @Query('take') take: number,
    @Query('cursor') cursor: string,
    @Query('search') search: string,
    @Query('orderBy') orderBy: string,
  ) {
    const where: Prisma.GeneralWhereInput = {};
    if (search) {
      where.OR = [
        { info: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    let order: Prisma.GeneralOrderByWithRelationInput = {};
    if (orderBy) {
      const [field, direction] = orderBy.split(':');
      order = { [field]: direction.toLowerCase() as 'asc' | 'desc' };
    }

    let cursorObj: Prisma.GeneralWhereUniqueInput | undefined = undefined;
    if (cursor) {
      cursorObj = { id: String(cursor) };
    }

    const queryParams = {
      skip,
      take,
      cursor: cursorObj,
      where,
      orderBy: order,
    };

    return this.generalsService.findAll(queryParams);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a general record by ID' })
  @ApiResponse({ status: 200, description: 'General info found' })
  @ApiResponse({ status: 404, description: 'General info not found' })
  findOne(@Param('id') id: string) {
    return this.generalsService.findOne(id);
  }

  @Roles(Role.Admin, Role.SuperAdmin)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update general information by ID' })
  @ApiResponse({ status: 200, description: 'General info updated successfully' })
  @ApiResponse({ status: 404, description: 'General info not found' })
  update(@Param('id') id: string, @Body() updateGeneralDto: UpdateGeneralDto) {
    return this.generalsService.update(id, updateGeneralDto);
  }

  @Roles(Role.Admin, Role.SuperAdmin)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete general information by ID' })
  @ApiResponse({ status: 200, description: 'General info deleted successfully' })
  @ApiResponse({ status: 404, description: 'General info not found' })
  remove(@Param('id') id: string) {
    return this.generalsService.remove(id);
  }
}
