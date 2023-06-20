import { Body, Controller, Get, Inject, Post, Query, Req, Res } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { GrpcConfigs } from 'common';
import { ClientGrpc } from '@nestjs/microservices';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { transactionController } from '../../proto-gen/service';
import { Request, Response } from 'express';
import { lastValueFrom } from 'rxjs';
import { InitTransactionDto, TransactionResultDto } from '../dto/transaction.dto';

@Controller('transaction')
export class TransactionController {

  transactionController: transactionController;
  constructor(
    private readonly configService: ConfigService,
    @Inject(GrpcConfigs.ConnectionName) private client: ClientGrpc,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
    this.transactionController = this.client.getService<transactionController>('transactionController');
  }

  @Post('init')
  initTransaction(
    @Body() body: InitTransactionDto,
    @Req() req: Request
  ) {
    return lastValueFrom(this.transactionController.initTransaction({
      ...body
    }))
  }

  @Get('webpay/result')
  async getTransactionResult(
    @Query() request: TransactionResultDto,
    @Res() res: Response
  ) {
    const urlReturn = await lastValueFrom(this.transactionController.getTransactionResult({
      tokenWs: request.token_ws,
      tbkToken: request.TBK_TOKEN,
    }));
    res.redirect(303, urlReturn.redirectUrl);
  }
}
