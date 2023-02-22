import { Controller } from '@nestjs/common';
import { TransactionService } from '../service/transaction.service';
import {BigCommerceTransaction, TransactionDto, TransactionResultDto} from '../dto/transaction.dto';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @GrpcMethod('transactionController', 'initTransaction')
  initTransaction(body: TransactionDto) {
    return this.transactionService.initTransaction(body);
  }

  @GrpcMethod('transactionController', 'getTransactionResult')
  getTransactionResult(
    request: TransactionResultDto,
  ) {
    return this.transactionService.getTransactionResult(request);
  }

  @GrpcMethod('transactionController', 'bigCommerceTransaction')
  bigCommerceTransaction(
    request: BigCommerceTransaction,
  ) {
    return this.transactionService.createTransactionBigCommerce(request);
  }
}
