import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { loggerOptions } from 'utils';
import { WinstonModule } from 'nest-winston';
import { ConfigModule } from '@nestjs/config';
import { CoreServiceValidateConfig } from './config/core-service.validate.config';
import { CoreConfigModule } from './config/core-config.module';
import { CoreServiceConfig } from './config/core-service.config';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
