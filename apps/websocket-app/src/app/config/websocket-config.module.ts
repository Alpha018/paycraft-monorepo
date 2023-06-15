import { Global, Module } from '@nestjs/common';
import { WebsocketServiceConfig } from './websocket-service.config';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [WebsocketServiceConfig, ConfigService],
  exports: [WebsocketServiceConfig],
})
export class WebsocketConfigModule {}
