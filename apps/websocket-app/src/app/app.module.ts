import { Module } from '@nestjs/common'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { loggerOptions } from 'utils';
import { BullModule } from '@nestjs/bull';
import { WebsocketServiceValidateConfig } from './config/websocket-service.validate.config';
import { WebsocketConfigModule } from './config/websocket-config.module';
import { WebsocketServiceConfig } from './config/websocket-service.config';
import { ConnectionsModule } from './domain/connections/connections.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpressAdapter } from '@bull-board/express';
import { BullBoardModule } from '@bull-board/nestjs';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: WebsocketServiceValidateConfig,
    }),
    WinstonModule.forRootAsync({
      imports: [WebsocketConfigModule],
      useFactory: (configService: WebsocketServiceConfig) => ({
        ...loggerOptions(configService.applicationName)
      }),
      inject: [WebsocketServiceConfig],
    }),
    BullModule.forRootAsync({
      imports: [WebsocketConfigModule],
      useFactory: async (configService: WebsocketServiceConfig) => ({
        url: configService.redisConfiguration.url,
        redis: { tls: {} }
      }),
      inject: [WebsocketServiceConfig],
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter
    }),
    MongooseModule.forRootAsync({
      imports: [WebsocketConfigModule],
      useFactory: async (configService: WebsocketServiceConfig) => ({
        uri: configService.mongoConfiguration.url,
      }),
      inject: [WebsocketServiceConfig],
    }),
    ConnectionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
