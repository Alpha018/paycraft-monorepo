import { Module } from '@nestjs/common'
import { HookModule } from './domain/hook/hook.module';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { loggerOptions } from 'utils';
import { RestServiceValidateConfig } from './config/rest-service.validate.config';
import { RestServiceConfig } from './config/rest-service.config';
import { RestConfigModule } from './config/rest-config.module';

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
    HookModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
