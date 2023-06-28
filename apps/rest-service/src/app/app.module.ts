import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { loggerOptions } from 'utils';
import { RestServiceValidateConfig } from './config/rest-service.validate.config';
import { RestServiceConfig } from './config/rest-service.config';
import { RestConfigModule } from './config/rest-config.module';
import { SharedModule } from './shared/shared.module';
import { PlanModule } from './domain/plan/plan.module';
import { ServerModule } from './domain/server/server.module';
import { TransactionModule } from './domain/transaction/transaction.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { GrpcModule } from "./utils/wrapper/grpc.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: RestServiceValidateConfig,
    }),
    WinstonModule.forRootAsync({
      imports: [RestConfigModule],
      useFactory: (configService: RestServiceConfig) => ({
        ...loggerOptions(configService.applicationName)
      }),
      inject: [RestServiceConfig],
    }),
    RestConfigModule,
    SharedModule,
    PlanModule,
    ServerModule,
    TransactionModule,
    GrpcModule
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService
  ],
})
export class AppModule {}
