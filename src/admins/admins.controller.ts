import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Prisma } from '@prisma/client';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { RolesGuard } from '../guards/roles.guard';
import { SelfGuard } from '../guards/self.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Admins')
@Roles(Role.SuperAdmin)
@UseGuards(RolesGuard)
@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new admin' })
  @ApiResponse({ status: 201, description: 'Admin created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminsService.create(createAdminDto);
  }


  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all admins with optional filters' })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'cursor', required: false })
  @ApiQuery({ name: 'search', required: false, description: 'Search by name or email' })
  @ApiQuery({ name: 'orderBy', required: false, example: 'email:asc' })
  @ApiResponse({ status: 200, description: 'Admins fetched successfully' })
  findAll(
    @Query('skip') skip: number,
    @Query('take') take: number,
    @Query('cursor') cursor: string,
    @Query('search') search: string,
    @Query('orderBy') orderBy: string,
  ) {
    const where: Prisma.AdminWhereInput = {};
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { fullname: { contains: search, mode: 'insensitive' } },
      ];
    }

    let order: Prisma.AdminOrderByWithRelationInput = {};
    if (orderBy) {
      const [field, direction] = orderBy.split(':');
      order = { [field]: direction.toLowerCase() as 'asc' | 'desc' };
    }

    let cursorObj: Prisma.AdminWhereUniqueInput | undefined = undefined;
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

    return this.adminsService.findAll(queryParams);
  }

  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(SelfGuard)
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a single admin by ID' })
  @ApiResponse({ status: 200, description: 'Admin found' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  findOne(@Param('id') id: string) {
    return this.adminsService.findOne(id);
  }

  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(SelfGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an admin by ID' })
  @ApiResponse({ status: 200, description: 'Admin updated successfully' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminsService.update(id, updateAdminDto);
  }

  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(SelfGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an admin by ID' })
  @ApiResponse({ status: 200, description: 'Admin deleted successfully' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  remove(@Param('id') id: string) {
    return this.adminsService.remove(id);
  }
}
