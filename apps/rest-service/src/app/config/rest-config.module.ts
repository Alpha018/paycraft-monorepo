import { Global, Module } from "@nestjs/common";
import { RestServiceConfig } from './rest-service.config';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [RestServiceConfig, ConfigService],
  exports: [RestServiceConfig],
})
export class RestConfigModule {}
