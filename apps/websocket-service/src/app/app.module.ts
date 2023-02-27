import { Module } from '@nestjs/common'
import { ConnectionsModule } from './domain/connections/connections.module';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { loggerOptions } from 'utils';
import { WebsocketServiceValidateConfig } from './config/websocket-service.validate.config';
import { MongooseModule } from '@nestjs/mongoose';
import { WebsocketServiceConfig } from './config/websocket-service.config';
import { WebsocketConfigModule } from './config/websocket-config.module';
import { BullModule } from '@nestjs/bull';

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
      useFactory: (configService: WebsocketServiceConfig) => ({
        redis: {
          host: configService.redisConfig.host,
          port: +configService.redisConfig.port,
        },
      }),
      inject: [WebsocketServiceConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [WebsocketConfigModule],
      useFactory: async (configService: WebsocketServiceConfig) => ({
        uri: configService.mongoConfig.url,
      }),
      inject: [WebsocketServiceConfig],
    }),
    ConnectionsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
