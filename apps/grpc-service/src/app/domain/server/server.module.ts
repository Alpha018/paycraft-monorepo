import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServerController } from './controller/server.controller';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [
    ConfigModule,
    SharedModule,
  ],
  providers: [],
  controllers: [
    ServerController
  ],
  exports: [],
})
export class ServerModule {}
