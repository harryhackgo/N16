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
import { FaqsService } from './faqs.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
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
import { Public } from '../decorators/public.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Roles(Role.Admin, Role.SuperAdmin)
@UseGuards(RolesGuard)
@ApiTags('Faqs')
@UseInterceptors(CacheInterceptor)
@Controller('faqs')
export class FaqsController {
  constructor(private readonly faqsService: FaqsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new FAQ entry' })
  @ApiResponse({ status: 201, description: 'FAQ created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  create(@Body() createFaqDto: CreateFaqDto) {
    return this.faqsService.create(createFaqDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get a list of FAQs with optional filters' })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'cursor', required: false })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by question or answer in any language',
  })
  @ApiQuery({ name: 'orderBy', required: false, example: 'createdAt:desc' })
  @ApiResponse({ status: 200, description: 'List of FAQs returned' })
  findAll(
    @Query('skip') skip: number,
    @Query('take') take: number,
    @Query('cursor') cursor: string,
    @Query('search') search: string,
    @Query('orderBy') orderBy: string,
  ) {
    const where: Prisma.FaqWhereInput = {};
    if (search) {
      where.OR = [
        { question: { contains: search, mode: 'insensitive' } },
        { questionUz: { contains: search, mode: 'insensitive' } },
        { questionRu: { contains: search, mode: 'insensitive' } },
        { answer: { contains: search, mode: 'insensitive' } },
        { answerUz: { contains: search, mode: 'insensitive' } },
        { answerRu: { contains: search, mode: 'insensitive' } },
      ];
    }

    let order: Prisma.FaqOrderByWithRelationInput | undefined = undefined;
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

    const cursorObj: Prisma.FaqWhereUniqueInput | undefined = cursor
      ? { id: String(cursor) }
      : undefined;

    const queryParams = {
      skip,
      take,
      cursor: cursorObj,
      where,
      orderBy: order,
    };

    return this.faqsService.findAll(queryParams);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a FAQ entry by ID' })
  @ApiResponse({ status: 200, description: 'FAQ found' })
  @ApiResponse({ status: 404, description: 'FAQ not found' })
  findOne(@Param('id') id: string) {
    return this.faqsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a FAQ by ID' })
  @ApiResponse({ status: 200, description: 'FAQ updated successfully' })
  @ApiResponse({ status: 404, description: 'FAQ not found' })
  update(@Param('id') id: string, @Body() updateFaqDto: UpdateFaqDto) {
    return this.faqsService.update(id, updateFaqDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a FAQ by ID' })
  @ApiResponse({ status: 200, description: 'FAQ deleted successfully' })
  @ApiResponse({ status: 404, description: 'FAQ not found' })
  remove(@Param('id') id: string) {
    return this.faqsService.remove(id);
  }
}
