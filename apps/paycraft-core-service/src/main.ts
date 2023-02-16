/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { join } from 'path';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { loggerOptions } from 'utils';
import { WinstonModule } from 'nest-winston';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RpcValidationFilter } from 'common';


async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: 'localhost:3000',
      package: 'core',
      protoPath: join(__dirname, '..', '..', 'libs', 'common', 'src', 'assets', 'proto', 'service.proto'),
      loader: {
        keepCase: true,
        longs: Number,
        enums: String,
        defaults: false,
        arrays: true,
        objects: true,
        includeDirs: [
          join(__dirname, '..', '..', 'libs', 'common', 'src', 'assets', 'proto')
        ],
      },
    },
    logger: WinstonModule.createLogger({
      ...loggerOptions(process.env.APPLICATION_NAME)
    }),
  });

  app.useGlobalFilters(new RpcValidationFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  await app.listen();
}

bootstrap();
