import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { nanoid } from 'nanoid';
import { createWinstonContext } from 'utils';
import {
  IntegrationApiKeys,
  IntegrationCommerceCodes,
  Options,
} from 'transbank-sdk';
import { CoreServiceConfig } from '../../config/core-service.config';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const WebpayPlus = require('transbank-sdk').WebpayPlus;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Environment = require('transbank-sdk').Environment;

export interface WebpayOutput {
  vci: string;
  amount: number;
  status: string;
  buy_order: string;
  session_id: string;
  card_detail: { card_number: string };
  accounting_date: string;
  transaction_date: string;
  authorization_code: string;
  payment_type_code: string;
  response_code: number;
  installments_number: number;
}

@Injectable()
export class TransbankService implements OnModuleInit {
  private sessionId: string;
  private transaction;

  constructor(
    private readonly configService: CoreServiceConfig,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
    this.sessionId = `PayCraft-Session-${nanoid()}`;
  }

  onModuleInit() {
    try {
      if (this.configService.appConfig.nodeEnv === 'production') {
        this.transaction = new WebpayPlus.Transaction(
          new Options(
            this.configService.transbankConfig.commerceCode,
            this.configService.transbankConfig.apiKey,
            Environment.Production
          )
        );
      } else {
        this.transaction = new WebpayPlus.Transaction(
          new Options(
            IntegrationCommerceCodes.WEBPAY_PLUS,
            IntegrationApiKeys.WEBPAY,
            Environment.Integration
          )
        );
      }
    } catch (e) {
      this.logger.error('Error getting configuration: ', e);
      throw e;
    }
  }

  async initTransaction(amount: number, buyOrder: string) {
    const meta = createWinstonContext(
      this.constructor.name,
      this.initTransaction.name
    );

    try {
      const returnUrl = this.configService.transbankConfig.returnUrl;
      const { url, token } = await this.transaction.create(
        buyOrder,
        this.sessionId,
        amount,
        returnUrl
      );

      return { url, token };
    } catch (error) {
      this.logger.error('Error starting transaction at tbk library: ', {
        ...meta,
        error: error.message,
      });
      throw error;
    }
  }

  async getTransactionResult(token: string): Promise<WebpayOutput> {
    const meta = createWinstonContext(
      this.constructor.name,
      this.getTransactionResult.name
    );

    try {
      return WebpayPlus.Transaction.status(token);
    } catch (error) {
      this.logger.error('Error in get transaction data', {
        ...meta,
        error: error.message,
      });
      throw error;
    }
  }

  async confirmTransaction(token: string): Promise<WebpayOutput> {
    const meta = createWinstonContext(
      this.constructor.name,
      this.confirmTransaction.name
    );

    try {
      return this.transaction.commit(token);
    } catch (error) {
      this.logger.error('Error in confirm transaction', {
        ...meta,
        error: error.message,
      });
      throw error;
    }
  }
}
