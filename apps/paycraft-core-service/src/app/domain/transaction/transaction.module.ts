import { Module } from '@nestjs/common';

import { CoreConfigModule } from '../../config/core-config.module';
import { HandleModule } from '../handlers/handle.module';
import { SharedModule } from '../../shared/shared.module';
import { TransactionController } from './controller/transaction.controller';
import { CommandRepository } from './repository/command.repository';
import { TransactionRepository } from './repository/transaction.repository';
import { TransactionService } from './service/transaction.service';
import { PrismaService } from '../../prisma.service';
import { PlanModule } from '../plan/plan.module';
import { ServerModule } from '../server/server.module';

@Module({
  imports: [
    HandleModule,
    CoreConfigModule,
    SharedModule,
    PlanModule,
    ServerModule
  ],
  controllers: [
    TransactionController
  ],
  providers: [
    PrismaService,
    CommandRepository,
    TransactionRepository,
    TransactionService
  ]
})
export class TransactionModule {}
