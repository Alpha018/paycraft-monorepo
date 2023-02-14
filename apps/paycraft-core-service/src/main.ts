/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { loggerOptions } from 'utils';
import { WinstonModule } from 'nest-winston';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger({
      ...loggerOptions(process.env.APPLICATION_NAME)
    }),
  });
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3333;
  const globalPrefix = 'api';

  app.enableCors({
    origin: '*',
    allowedHeaders: [
      'Content-Type',
      'Authorization',
    ],
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    preflightContinue: false,
  });
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  await app.listen(port, () => {
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  });
}

bootstrap();
