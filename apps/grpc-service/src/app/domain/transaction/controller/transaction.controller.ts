import { Controller, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GrpcConfigs } from 'common';
import { ClientGrpc, GrpcMethod } from '@nestjs/microservices';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { transactionController } from '../../proto-gen/service';
import { lastValueFrom } from 'rxjs';
import { InitTransactionDto } from '../dto/transaction.dto';
import { Metadata } from '@grpc/grpc-js';

@Controller()
export class TransactionController {

  transactionController: transactionController;
  constructor(
    private readonly configService: ConfigService,
    @Inject(GrpcConfigs.ConnectionName) private client: ClientGrpc,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
    this.transactionController = this.client.getService<transactionController>('transactionController');
  }

  @GrpcMethod('TransactionController', 'initTransaction')
  initTransaction(params: InitTransactionDto) {
    return lastValueFrom(this.transactionController.initTransaction({
      ...params
    }))
  }
}
