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
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
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

@Roles(Role.SuperAdmin)
@UseGuards(RolesGuard)
@ApiTags('Cards')
@UseInterceptors(CacheInterceptor)
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Roles(Role.SuperAdmin, Role.User)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new card' })
  @ApiResponse({ status: 201, description: 'Card created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  create(@Body() createCardDto: CreateCardDto) {
    return this.cardsService.create(createCardDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a list of cards with optional filters' })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'cursor', required: false })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by card number or due date',
  })
  @ApiQuery({ name: 'orderBy', required: false, example: 'createdAt:desc' })
  @ApiResponse({ status: 200, description: 'List of cards returned' })
  findAll(
    @Query('skip') skip: number,
    @Query('take') take: number,
    @Query('cursor') cursor: string,
    @Query('search') search: string,
    @Query('orderBy') orderBy: string,
  ) {
    const where: Prisma.CardWhereInput = {};
    if (search) {
      where.OR = [
        { card_number: { contains: search, mode: 'insensitive' } },
        { due_date: { contains: search, mode: 'insensitive' } },
      ];
    }

    let order: Prisma.CardOrderByWithRelationInput | undefined = undefined;
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

    const cursorObj: Prisma.CardWhereUniqueInput | undefined = cursor
      ? { id: String(cursor) }
      : undefined;

    const queryParams = {
      skip,
      take,
      cursor: cursorObj,
      where,
      orderBy: order,
    };

    return this.cardsService.findAll(queryParams);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a card by ID' })
  @ApiResponse({ status: 200, description: 'Card found' })
  @ApiResponse({ status: 404, description: 'Card not found' })
  findOne(@Param('id') id: string) {
    return this.cardsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a card by ID' })
  @ApiResponse({ status: 200, description: 'Card updated successfully' })
  @ApiResponse({ status: 404, description: 'Card not found' })
  update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardsService.update(id, updateCardDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a card by ID' })
  @ApiResponse({ status: 200, description: 'Card deleted successfully' })
  @ApiResponse({ status: 404, description: 'Card not found' })
  remove(@Param('id') id: string) {
    return this.cardsService.remove(id);
  }
}
