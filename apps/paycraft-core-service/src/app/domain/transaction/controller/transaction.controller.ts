import { Controller } from '@nestjs/common';
import { TransactionService } from '../service/transaction.service';
import { TransactionDto, TransactionResultDto } from '../dto/transaction.dto';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @GrpcMethod('transactionController', 'initTransaction')
  initTransaction(body: TransactionDto) {
    return this.transactionService.initTransaction(body);
  }

  @GrpcMethod('transactionController', 'getTransactionResult')
  async getTransactionResult(
    request: TransactionResultDto,
  ) {
    return this.transactionService.getTransactionResult(request);
  }
}
