import { Module } from '@nestjs/common';
import { CoreServiceConfig } from './core-service.config';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [CoreServiceConfig, ConfigService],
  exports: [CoreServiceConfig],
})
export class CoreConfigModule {}
