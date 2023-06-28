import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PlanController } from './controller/plan.controller';
import { SharedModule } from '../../shared/shared.module';
import { AdminUserMiddleware } from '../../shared/middleware/admin-user.middleware';

@Module({
  imports: [
    ConfigModule,
    SharedModule,
  ],
  providers: [],
  controllers: [
    PlanController
  ],
  exports: [],
})
export class PlanModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AdminUserMiddleware)
      .forRoutes(PlanController);
  }
}
