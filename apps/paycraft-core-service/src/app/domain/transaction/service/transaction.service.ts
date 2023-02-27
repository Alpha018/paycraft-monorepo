import { HttpException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createWinstonContext, generateUrl } from 'utils';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { nanoid } from 'nanoid';
import { TransbankService } from '../../../shared/service/transbank.service';
import { PlanRepository } from '../../plan/repository/plan.repository';
import { ServerRepository } from '../../server/repository/server.repository';
import { BigCommerceTransaction, TransactionDto, TransactionResultDto } from '../dto/transaction.dto';
import { PaymentMethod, TransactionStatus, CommandStatus } from '@prisma/client'
import { TransactionRepository } from '../repository/transaction.repository';
import { CommandRepository } from '../../command/repository/command.repository';
import { PrismaErrorHandler } from '../../handlers/handle-prisma-error';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class TransactionService {
  constructor(
    private readonly configService: ConfigService,
    private readonly transbank: TransbankService,
    private readonly transactionRepository: TransactionRepository,
    private readonly planRepository: PlanRepository,
    private readonly serverRepository: ServerRepository,
    private readonly commandRepository: CommandRepository,
    private readonly prismaErrorHandler: PrismaErrorHandler,
    @InjectQueue('TRANSACTION') private readonly transactionQueue: Queue,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
  }

  async initTransaction(
    request: TransactionDto,
  ): Promise<{
    url: string;
    token: string;
    transactionId: number;
    redirect: string;
  }> {
    const meta = createWinstonContext(
      this.constructor.name,
      this.initTransaction.name
    );

    // eslint-disable-next-line sonarjs/no-small-switch
    switch (request.payMethod) {
      case PaymentMethod.TRANSBANK: {
        this.logger.info('Init Transaction', { ...meta });

        let plan
        try {
          plan = await this.planRepository.getPlanById(request.planId);
        } catch (e) {
          this.prismaErrorHandler.handlePrismaErrors(e, this.initTransaction.name)
        }

        if (!plan || request.serverId !== plan.serverId) {
          this.logger.error('User not have permission to generate webpay url', {
            ...meta,
            serverId: request.serverId,
            plan: request.planId,
          });
          throw new HttpException(
            'You don\'t haver permission to generate this url or plan not exist',
            403
          );
        }

        const orderId = `PayCraft-Order-${nanoid(10)}`;
        const { url, token } = await this.transbank.initTransaction(
          plan.amount,
          orderId
        );

        this.logger.info('Save transaction', { ...meta });

        let transaction;
        try {
          transaction = await this.transactionRepository.createTransaction({
            status: TransactionStatus.STARTED,
            token: token,
            amount: plan.amount,
            userName: request.userName,
            payMethod: PaymentMethod.TRANSBANK,
            serverId: request.serverId,
            planId: request.planId
          });
        } catch (e) {
          this.prismaErrorHandler.handlePrismaErrors(e, this.initTransaction.name);
        }

        this.logger.info('Redirect to webpay with', {
          ...meta,
          id: transaction.id,
        });
        return {
          url,
          token,
          transactionId: transaction.id,
          redirect: `${url}?token_ws=${token}`,
        };
      }
      default: {
        this.logger.info('PaymentMethod is not register', {
          ...meta,
          serverId: request.serverId,
          plan: request.planId,
          paymentMethod: request.payMethod,
        });
        throw new HttpException('PaymentMethod is not exist', 500);
      }
    }
  }

  async getTransactionResult(webpay: TransactionResultDto) {
    const meta = createWinstonContext(
      this.constructor.name,
      this.getTransactionResult.name
    );
    const { tokenWs: token, tbkToken: failToken } = webpay;

    if (!token && failToken) {

      let transaction
      try {
        transaction = await this.transactionRepository.getTransactionByWebpay(failToken);
      } catch (e) {
        this.prismaErrorHandler.handlePrismaErrors(e, this.getTransactionResult.name);
      }


      this.logger.error('Token of webpay response not exist', {
        ...meta,
      });

      try {
        await this.transactionRepository.setTransaction(
          token,
          TransactionStatus.ERROR
        );
      } catch (e) {
        this.prismaErrorHandler.handlePrismaErrors(e, this.getTransactionResult.name);
      }

      const url = generateUrl(transaction.server.failPaymentUrl, {
        webpayToken: transaction.token,
        payMethod: transaction.payMethod,
      });
      return {
        redirectUrl: url.toString()
      };
    }

    const [transaction, dataWebpay] = await Promise.all([
      this.transactionRepository.getTransactionByWebpay(token),
      this.transbank.confirmTransaction(token),
    ]);

    const plan = await this.planRepository.getPlanById(
      transaction.planId
    );
    const success = dataWebpay.response_code === 0;

    if (!transaction || !dataWebpay || !plan) {
      this.logger.error('Transaction result fatal error', {
        ...meta,
        transaction,
        dataWebpay,
        plan,
      });
      await this.transactionRepository.setTransaction(
        token,
        TransactionStatus.ERROR,
        dataWebpay
      );
      const url = generateUrl(transaction.server.failPaymentUrl, {
        webpayToken: transaction.token,
        payMethod: transaction.payMethod,
      });
      return {
        redirectUrl: url.toString()
      }
    }

    if (!success) {
      this.logger.error('Transaction result not success transaction', {
        ...meta,
        dataWebpay,
      });
      await this.transactionRepository.setTransaction(
        token,
        TransactionStatus.ERROR,
        dataWebpay
      );
      const url = generateUrl(transaction.server.failPaymentUrl, {
        webpayToken: transaction.token,
        payMethod: transaction.payMethod,
      });
      return {
        redirectUrl: url.toString()
      }
    }

    this.logger.info('Transaction result success, CACHIN!!', {
      ...meta,
      dataWebpay,
    });

    try {
      await this.transactionRepository.setTransaction(
        token,
        TransactionStatus.PAID,
        dataWebpay
      );
      const command = await this.commandRepository.createCommand({
          status: CommandStatus.STARTED,
          transactionId: transaction.id,
          userName: transaction.userName,
        },
        plan.executeCommands.map((data) => ({
          ...this.createCommandOption(data, transaction.userName)
        })),
        plan.expiredCommands.map((data) => ({
          ...this.createCommandOption(data, transaction.userName)
        })));

      // TODO: send command to server via websocket
      // await this.connectionSocketService.sendCommandToServerHook(
      //   transaction.server.serverToken,
      //   command.id
      // );

      // SEND TO SERVER
      await this.transactionQueue.add({
        serverToken: transaction.server.serverToken,
        id: command.id
      });

      this.logger.info('Command created, redirecting...', { ...meta });
      const url = generateUrl(transaction.server.successPaymentUrl, {
        ...dataWebpay,
      });
      return {
        redirectUrl: url.toString()
      }
    } catch (e) {
      this.logger.error('FATAL: error in command creation!!', {
        ...meta,
        dataWebpay,
        webpayToken: token,
        error: e.message,
      });
      throw new HttpException('Error to create a command', 500);
    }
  }

  createCommandOption(
    data: { requiredOnline: boolean; command: string },
    userName
  ): {
    requiredOnline: boolean,
    command: string
  } {
    return {
      requiredOnline: data.requiredOnline,
      command: data.command.replace(/{username}/gi, userName),
    };
  }

  getTransactionsByServer(
    serverId: number,
    startDate: Date,
    endDate: Date,
    status?: TransactionStatus
  ) {
    return this.transactionRepository.getServerTransactions(
      serverId,
      startDate,
      endDate,
      status
    );
  }

  async getTransactionMetrics(serverId: number, startDate: Date, endDate: Date) {
    const transactions = await this.getTransactionsByServer(
      serverId,
      startDate,
      endDate,
      TransactionStatus.PAID
    );

    let total = 0;
    for (const transaction of transactions) {
      total = total + transaction.amount;
    }

    return {
      total,
      discountTotal: total * 0.9,
      count: transactions.length,
    };
  }

  async createTransactionBigCommerce(request: BigCommerceTransaction): Promise<{ transactionId: number; }> {
    const meta = createWinstonContext(
      this.constructor.name,
      this.createTransactionBigCommerce.name
    );

    let plan
    try {
      plan = await this.planRepository.getPlanById(request.planId);
    } catch (e) {

      this.prismaErrorHandler.handlePrismaErrors(e, this.initTransaction.name)
    }

    if (!plan) {
      this.logger.error('Plan not found', {
        ...meta,
        planId: request.planId
      });
      throw new NotFoundException('Plan not found');
    }

    const orderId = `PayCraft-Order-${nanoid(10)}`;
    let transaction;

    this.logger.info('Starting process to send information', {
      ...meta
    })
    try {
      transaction = await this.transactionRepository.createTransaction({
        status: TransactionStatus.PAID,
        token: orderId,
        amount: plan.amount,
        userName: request.userName,
        payMethod: PaymentMethod.TRANSBANK,
        serverId: request.serverId,
        planId: request.planId,
        rawData: request.rawData as never
      });

      this.logger.info('Transaction created', {
        ...meta
      })

      const command = await this.commandRepository.createCommand({
          status: CommandStatus.STARTED,
          transactionId: transaction.id,
          userName: transaction.userName,
        },
        plan.executeCommands.map((data) => ({
          ...this.createCommandOption(data, transaction.userName)
        })),
        plan.expiredCommands.map((data) => ({
          ...this.createCommandOption(data, transaction.userName)
        })));

      this.logger.info('Command Created!!', {
        ...meta
      })

      await this.transactionQueue.add({
        serverToken: transaction.server.serverToken,
        id: command.id
      });
    } catch (e) {
      this.logger.error('Error in prisma', {
        ...meta,
        e: e
      })
      this.prismaErrorHandler.handlePrismaErrors(e, this.initTransaction.name);
    }

    return {
      transactionId: transaction.id
    }
  }
}
