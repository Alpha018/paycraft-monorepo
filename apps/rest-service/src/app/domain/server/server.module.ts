import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServerController } from './controller/server.controller';
import { SharedModule } from '../../shared/shared.module';
import { AdminUserMiddleware } from '../../shared/middleware/admin-user.middleware';

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
export class ServerModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AdminUserMiddleware)
      .forRoutes(ServerController);
  }
}
