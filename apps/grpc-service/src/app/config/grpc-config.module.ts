import { Global, Module } from '@nestjs/common';
import { GrpcServiceConfig } from './grpc-service.config';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [GrpcServiceConfig, ConfigService],
  exports: [GrpcServiceConfig],
})
export class GrpcConfigModule {}
