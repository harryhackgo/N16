import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma.service';
import { MulterModule } from '@nestjs/platform-express';
import { ProductsResolver } from './products.resolver';

@Module({
  imports: [MulterModule.registerAsync({
    useFactory: () => ({
      dest: './uploads',})
  })],
  providers: [ProductsService, PrismaService, ProductsResolver],
})
export class ProductsModule {}
