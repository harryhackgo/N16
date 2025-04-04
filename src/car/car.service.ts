import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car) private readonly carRepo: Repository<Car>,
  ) {}

  async create(createCarDto: CreateCarDto) {
    try {
      const existingCar = await this.carRepo.findOne({
        where: { make: createCarDto.make, model: createCarDto.model },
      });
      if (existingCar) {
        throw new BadRequestException('Car already exists');
      }
      const car = this.carRepo.create(createCarDto);
      return this.carRepo.save(car);
    } catch (error) {
      throw new BadRequestException('BadRequestException creating car: ' + error.message);
    }
  }

  findAll() {
    try {
      return this.carRepo.find();
    } catch (error) {
      throw new BadRequestException('BadRequestException fetching cars: ' + error.message);
    }
  }

  async findOne(id: string) {
    try {
      const car = await this.carRepo.findOne({ where: { id: +id } });
      if (!car) {
        throw new BadRequestException('Car not found');
      }
      return car;
    } catch (error) {
      throw new BadRequestException('BadRequestException fetching car: ' + error.message);
    }
  }

  async update(id: string, updateCarDto: UpdateCarDto) {
    try {
      const car = await this.carRepo.findOne({ where: { id: +id } });
      if (!car) {
        throw new BadRequestException('Car not found');
      }
      const updatedCar = Object.assign(car, updateCarDto);
      return this.carRepo.save(updatedCar);
    } catch (error) {
      throw new BadRequestException('BadRequestException updating car: ' + error.message);
    }
  }

  async remove(id: string) {
    try {
      const result = await this.carRepo.delete({ id: +id });
      if (result.affected == 0) {
        throw new BadRequestException('Car not found or already deleted');
      }
      return { message: 'Car deleted successfully' };
    } catch (error) {
      throw new BadRequestException('BadRequestException removing car: ' + error.message);
    }
  }
}
