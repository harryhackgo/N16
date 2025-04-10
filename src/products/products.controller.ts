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
  UploadedFile,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Prisma } from '@prisma/client';
import {
  CacheInterceptor,
  CacheKey,
  CacheModule,
  CacheTTL,
} from '@nestjs/cache-manager';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { RolesGuard } from '../guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileSizeValidationPipe } from '../pipes/filesize.pipe';
import { multerOptions } from '../multer/multer.config';

@UseGuards(RolesGuard)
@Roles(Role.Admin)
@UseInterceptors(CacheInterceptor)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', multerOptions))
  create(@Body() createProductDto: CreateProductDto, @UploadedFile(new FileSizeValidationPipe()) file: Express.Multer.File) {
    const imagePath = file ? file.path : null;
    
    return this.productsService.create(createProductDto, imagePath);
  }

  @Roles(Role.User, Role.Admin, Role.SuperAdmin)
  @CacheTTL(120)
  @CacheKey('products')
  @Get()
  findAll(
    @Query('skip') skip: number,
    @Query('take') take: number,
    @Query('cursor') cursor: string,
    @Query('search') search: string,
    @Query('orderBy') orderBy: string,
  ) {
    const where: Prisma.ProductWhereInput = {};
    if (search) {
      where.OR = [
        { description: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }

    let order: Prisma.ProductOrderByWithRelationInput = {};
    if (orderBy) {
      const [field, direction] = orderBy.split(':');
      order = { [field]: direction.toLowerCase() as 'asc' | 'desc' };
    }

    let cursorObj: Prisma.ProductWhereUniqueInput | undefined = undefined;
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

    return this.productsService.findAll(queryParams);
  }

  @Roles(Role.User, Role.Admin, Role.SuperAdmin)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
