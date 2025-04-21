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
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Prisma } from '@prisma/client';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { RolesGuard } from '../guards/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Contacts')
@UseGuards(RolesGuard)
@Roles(Role.User, Role.Admin, Role.SuperAdmin)
@UseInterceptors(CacheInterceptor)
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Roles(Role.User, Role.SuperAdmin)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new contact' })
  @ApiResponse({ status: 201, description: 'Contact created successfully' })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or validation failed',
  })
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactsService.create(createContactDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a list of contacts with filters' })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'cursor', required: false })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by name, email or message',
  })
  @ApiQuery({ name: 'orderBy', required: false, example: 'email:asc' })
  @ApiResponse({ status: 200, description: 'List of contacts' })
  findAll(
    @Query('skip') skip: number,
    @Query('take') take: number,
    @Query('cursor') cursor: string,
    @Query('search') search: string,
    @Query('orderBy') orderBy: string,
  ) {
    const where: Prisma.ContactWhereInput = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
      ];
    }

    let order: Prisma.ContactOrderByWithRelationInput = {};
    if (orderBy) {
      const [field, direction] = orderBy.split(':');
      order = { [field]: direction.toLowerCase() as 'asc' | 'desc' };
    }

    let cursorObj: Prisma.ContactWhereUniqueInput | undefined = undefined;
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

    return this.contactsService.findAll(queryParams);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a contact by ID' })
  @ApiResponse({ status: 200, description: 'Contact found' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  findOne(@Param('id') id: string) {
    return this.contactsService.findOne(id);
  }

  @Roles(Role.User, Role.SuperAdmin)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a contact by ID' })
  @ApiResponse({ status: 200, description: 'Contact updated successfully' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
    return this.contactsService.update(id, updateContactDto);
  }

  @Roles(Role.User, Role.Admin, Role.SuperAdmin)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a contact by ID' })
  @ApiResponse({ status: 200, description: 'Contact deleted successfully' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  remove(@Param('id') id: string) {
    return this.contactsService.remove(id);
  }
}
