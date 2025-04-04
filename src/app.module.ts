import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CarModule } from './car/car.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './car/entities/car.entity';

@Module({
  imports: [
    CarModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'user',
      password: 'postgres',
      database: 'mydb',
      synchronize: true,
      entities: [Car],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
