import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Habilitar CORS para todos los orígenes
  app.enableCors({
    origin: '*', // Permite todos los orígenes
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Usar json
  app.use(bodyParser.json());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Prefijo API para todas las rutas
  app.setGlobalPrefix('api');

  const port = configService.get<number>('PORT') || 3000;
  app.use(morgan('dev')); // Puedes usar 'dev', 'combined', o configurar un formato personalizado

  await app.listen(port);
  console.log(`Application is running on port ${port}`);
}
bootstrap();
