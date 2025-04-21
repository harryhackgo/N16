import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Arbiat API')
    .setDescription('The Arbiat API description')
    .setVersion('1.0')
    .addTag('arbiat')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`Server is running on: ${process.env.PORT ?? 3000}`);
    console.log(`Swagger is running on: http://localhost:${process.env.PORT ?? 3000}/api`);
  });
}
bootstrap();
