import {
  Body,
  Controller, Inject, OnModuleInit,
  Post,
} from '@nestjs/common';
import { HookOrder } from '../dto/hook-order.dto';
import { BigcommerceService } from '../../../shared/service/bigcommerce.service';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

interface TransactionController {
  bigCommerceTransaction(params: {
    rawData: unknown;
    userName: string;
    planId: number;
    serverId: number;
  });
}

@Controller('hooks')
export class HookController implements OnModuleInit{

  private transactionService: TransactionController;
  constructor(
    private readonly bigCommerceService: BigcommerceService,
    @Inject('CORE_SERVICE') private client: ClientGrpc
  ) {
  }

  onModuleInit() {
    this.transactionService = this.client.getService<TransactionController>('transactionController');
  }
  @Post()
  async getUsersPlans(@Body() body: HookOrder) {
    const result = await this.bigCommerceService.getOrder(body.data.id)
    await lastValueFrom(this.transactionService.bigCommerceTransaction({
      ...result,
      serverId: 1,
    }))
    return {
      status: 'ok'
    }
  }
}
