import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('CarController (e2e)', () => {
  let app: INestApplication;
  let createdCarId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const testCar = {
    make: 'Chevrolet',
    model: 'Cobalt',
    year: 2024,
    color: 'White',
  };

  it('POST /api/car', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/car')
      .send(testCar)
      .expect(201);

    expect(res.body).toMatchObject(testCar);
    expect(res.body).toHaveProperty('id');
    createdCarId = res.body.id;
  });

  it('GET /api/car', async () => {
    const res = await request(app.getHttpServer()).get('/api/car');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /api/car/:id', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/car/${createdCarId}`)
      .expect(200);

    expect(res.body.id).toBe(createdCarId);
    expect(res.body.make).toBe(testCar.make);
  });

  it('PATCH /api/car/:id', async () => {
    const updatedColor = 'Red';
    const res = await request(app.getHttpServer())
      .patch(`/api/car/${createdCarId}`)
      .send({ color: updatedColor })
      .expect(200);

    expect(res.body.color).toBe(updatedColor);
  });

  it('DELETE /api/car/:id', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/api/car/${createdCarId}`)
      .expect(200);

    expect(res.body).toHaveProperty('affected'); 
  });

  it('GET /api/car/:id - should return an Error', async () => {
    await request(app.getHttpServer())
      .get(`/api/car/${createdCarId}`)
      .expect(404);
  });
});
