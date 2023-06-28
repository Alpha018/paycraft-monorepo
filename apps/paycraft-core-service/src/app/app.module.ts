import { Module } from '@nestjs/common';

import { loggerOptions } from 'utils';
import { WinstonModule } from 'nest-winston';
import { ConfigModule } from '@nestjs/config';
import { CoreServiceValidateConfig } from './config/core-service.validate.config';
import { CoreConfigModule } from './config/core-config.module';
import { CoreServiceConfig } from './config/core-service.config';
import { UserModule } from './domain/user/user.module';
import { ServerModule } from './domain/server/server.module';
import { PlanModule } from './domain/plan/plan.module';
import { TransactionModule } from './domain/transaction/transaction.module';
import { HealthController } from './health.controller';
import { CommandModule } from './domain/command/command.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: CoreServiceValidateConfig,
    }),
    WinstonModule.forRootAsync({
      imports: [CoreConfigModule],
      useFactory: (configService: CoreServiceConfig) => ({
        ...loggerOptions(configService.applicationName)
      }),
      inject: [CoreServiceConfig],
    }),
    CoreConfigModule,
    UserModule,
    ServerModule,
    PlanModule,
    TransactionModule,
    CommandModule,
  ],
  providers: [],
  controllers: [
    HealthController
  ]
})
export class AppModule {}
