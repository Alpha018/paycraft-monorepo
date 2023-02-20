import { Module } from '@nestjs/common';

import { PrismaService } from '../../prisma.service';
import { CoreConfigModule } from '../../config/core-config.module';
import { HandleModule } from '../handlers/handle.module';
import { ServerModule } from '../server/server.module';
import { UserModule } from '../user/user.module';
import { PlanController } from './controller/plan.controller';
import { PlanService } from './service/plan.service';
import { PlanRepository } from './repository/plan.repository';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [
    HandleModule,
    CoreConfigModule,
    ServerModule,
    UserModule,
    SharedModule
  ],
  controllers: [
    PlanController
  ],
  providers: [
    PrismaService,
    PlanService,
    PlanRepository,
  ],
  exports: [
    PlanRepository
  ]
})
export class PlanModule {}
