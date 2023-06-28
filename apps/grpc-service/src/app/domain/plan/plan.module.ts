import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PlanController } from './controller/plan.controller';
import { SharedModule } from '../../shared/shared.module';

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
export class PlanModule {}
