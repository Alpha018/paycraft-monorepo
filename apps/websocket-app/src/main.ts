/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app/app.module'
import { WinstonModule } from 'nest-winston';
import { loggerOptions } from 'utils';
import { RedisIoAdapter } from './app/domain/connections/adapters/redis.adapter';
import * as process from 'process';
import { Transport } from '@nestjs/microservices';
import { WebsocketServiceConfig } from './app/config/websocket-service.config';
import { AblyConstant } from 'common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      ...loggerOptions(process.env.APPLICATION_NAME)
    }),
  });

  const configService = app.get<WebsocketServiceConfig>(WebsocketServiceConfig);
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.ablyConfigs.queueUrl],
      queue: AblyConstant.QueueName,
      prefetchCount: 1,
      isGlobalPrefetchCount: true,
      queueOptions: {
        noAssert: true,
      }
    },
  });

  const globalPrefix = 'api'

  app.setGlobalPrefix(globalPrefix)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();

  app.useWebSocketAdapter(redisIoAdapter);


  const port = process.env.PORT || 3000
  await app.startAllMicroservices();
  await app.listen(port)

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  )
}

bootstrap()
