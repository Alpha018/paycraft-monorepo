import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TransactionController } from './controller/transaction.controller';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [
    ConfigModule,
    SharedModule,
  ],
  providers: [],
  controllers: [
    TransactionController
  ],
  exports: [],
})
export class TransactionModule {}
