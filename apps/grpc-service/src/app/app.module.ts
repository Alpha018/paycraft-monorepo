import { Module } from '@nestjs/common';

import { loggerOptions } from 'utils';
import { WinstonModule } from 'nest-winston';
import { ConfigModule } from '@nestjs/config';
import { GrpcServiceValidateConfig } from './config/grpc-service.validate.config';
import { GrpcConfigModule } from './config/grpc-config.module';
import { GrpcServiceConfig } from './config/grpc-service.config';
import { PlanModule } from './domain/plan/plan.module';
import { HealthController } from './health.controller';
import { ServerModule } from './domain/server/server.module';
import { TransactionModule } from './domain/transaction/transaction.module';
import { GrpcModule } from './utils/wrapper/grpc.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: GrpcServiceValidateConfig,
    }),
    WinstonModule.forRootAsync({
      imports: [GrpcConfigModule],
      useFactory: (configService: GrpcServiceConfig) => ({
        ...loggerOptions(configService.applicationName)
      }),
      inject: [GrpcServiceConfig],
    }),
    GrpcConfigModule,
    PlanModule,
    ServerModule,
    TransactionModule,
    GrpcModule
  ],
  providers: [],
  controllers: [
    HealthController
  ]
})
export class AppModule {}
