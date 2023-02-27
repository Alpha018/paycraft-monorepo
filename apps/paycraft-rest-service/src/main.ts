/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app/app.module'
import { WinstonModule } from 'nest-winston';
import { loggerOptions } from 'utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      ...loggerOptions(process.env.APPLICATION_NAME)
    }),
  });

  const globalPrefix = 'api'
  app.setGlobalPrefix(globalPrefix)
  app.enableCors()

  const port = process.env.PORT || 4000
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  await app.listen(port)
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  )
}

bootstrap()
