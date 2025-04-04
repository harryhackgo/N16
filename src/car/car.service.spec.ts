import { Test, TestingModule } from '@nestjs/testing';
import { CarService } from './car.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';

const mockCarRepo = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

describe('CarService', () => {
  let service: CarService;
  let repo: jest.Mocked<Repository<Car>>;

  const mockCar = {
    id: new ObjectId(),
    make: 'BMW',
    model: 'X5',
    year: 2022,
    color: 'black',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarService,
        {
          provide: getRepositoryToken(Car),
          useFactory: mockCarRepo,
        },
      ],
    }).compile();

    service = module.get<CarService>(CarService);
    repo = module.get(getRepositoryToken(Car));
  });

  it('should return all cars', async () => {
    repo.find.mockResolvedValue([mockCar]);

    const result = await service.findAll();
    expect(result).toEqual([mockCar]);
    expect(repo.find).toHaveBeenCalled();
  });

  it('should create a car', async () => {
    const dto = { make: 'BMW', model: 'X5', year: 2022, color: 'black' };
    repo.findOne.mockResolvedValue(null);
    repo.create.mockReturnValue(dto as any);
    repo.save.mockResolvedValue({ id: new ObjectId(), ...dto });

    const result = await service.create(dto);
    expect(result).toMatchObject(dto);
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw if car already exists when creating', async () => {
    repo.findOne.mockResolvedValue(mockCar);

    await expect(service.create(mockCar)).rejects.toThrow('Car already exists');
  });

  it('should find one car by id', async () => {
    repo.findOne.mockResolvedValue(mockCar);

    const result = await service.findOne(mockCar.id.toString());
    expect(result).toEqual(mockCar);
  });

  it('should throw if car not found', async () => {
    repo.findOne.mockResolvedValue(null);

    await expect(service.findOne(new ObjectId().toString())).rejects.toThrow('Car not found');
  });

  it('should update a car', async () => {
    const updateDto = { color: 'red' };
    repo.findOne.mockResolvedValue(mockCar);
    repo.save.mockResolvedValue({ ...mockCar, ...updateDto });

    const result = await service.update(mockCar.id.toString(), updateDto);
    expect(result).toEqual({ ...mockCar, ...updateDto });
  });

  it('should throw if car not found on update', async () => {
    repo.findOne.mockResolvedValue(null);

    await expect(
      service.update(new ObjectId().toString(), { color: 'red' }),
    ).rejects.toThrow('Car not found');
  });

  it('should remove a car', async () => {
    repo.delete.mockResolvedValue({ raw: {}, affected: 1 });
  
    const result = await service.remove(mockCar.id.toString());
    expect(result).toEqual({ raw: {}, affected: 1 });
  });  

  it('should handle error on remove', async () => {
    repo.delete.mockRejectedValue(new Error('Failed'));

    await expect(service.remove(mockCar.id.toString())).rejects.toThrow('Error removing car: Failed');
  });
});
