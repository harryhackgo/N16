import { Module } from '@nestjs/common';
import {  EskizService } from './eskiz.service';

@Module({
  controllers: [],
  providers: [EskizService],
  exports: [EskizService],
})
export class EskizModule {}
