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

@UseGuards(RolesGuard)
@Roles(Role.SuperAdmin)
@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post('new')
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminsService.create(createAdminDto);
  }

  @Get()
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
        { name: { contains: search, mode: 'insensitive' } }
      ];
    }

    let order: Prisma.AdminOrderByWithRelationInput = {};
    if (orderBy) {
      const [field, direction] = orderBy.split(':');
      order = { [field]: direction.toLowerCase() as 'asc' | 'desc' };
    }

    let cursorObj: Prisma.AdminWhereUniqueInput | undefined = undefined;
    if (cursor) {
      cursorObj = { id: Number(cursor) };
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
  findOne(@Param('id') id: number) {
    return this.adminsService.findOne(+id);
  }

  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(SelfGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminsService.update(+id, updateAdminDto);
  }

  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(SelfGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.adminsService.remove(+id);
  }
}
