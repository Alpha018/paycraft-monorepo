import { Module } from '@nestjs/common';

import { HandleModule } from '../handlers/handle.module';
import { SharedModule } from '../../shared/shared.module';
import { TransactionController } from './controller/transaction.controller';
import { CommandRepository } from './repository/command.repository';
import { TransactionRepository } from './repository/transaction.repository';
import { TransactionService } from './service/transaction.service';
import { PrismaService } from '../../prisma.service';
import { PlanModule } from '../plan/plan.module';
import { ServerModule } from '../server/server.module';
import { BullModule } from '@nestjs/bull';
import { QueueNames } from 'common';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

@Module({
  imports: [
    HandleModule,
    SharedModule,
    PlanModule,
    ServerModule,
    BullModule.registerQueueAsync(
      {
        name: QueueNames.Transaction,
      },
    ),
    BullBoardModule.forFeature({
      name: QueueNames.Transaction,
      adapter: BullMQAdapter, //or use BullAdapter if you're using bull instead of bullMQ
    }),
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
