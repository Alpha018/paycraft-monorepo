import { Module } from '@nestjs/common'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { loggerOptions } from 'utils';
import { WebsocketServiceValidateConfig } from './config/websocket-service.validate.config';
import { WebsocketConfigModule } from './config/websocket-config.module';
import { WebsocketServiceConfig } from './config/websocket-service.config';
import { ConnectionsModule } from './domain/connections/connections.module';
import { MongooseModule } from '@nestjs/mongoose';

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
