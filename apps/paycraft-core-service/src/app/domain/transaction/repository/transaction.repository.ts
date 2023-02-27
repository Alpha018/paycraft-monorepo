import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { Transaction, TransactionStatus } from '@prisma/client'
import { WebPaySuccessData } from '../interface/transbank.interface';

@Injectable()
export class TransactionRepository {
  constructor(
    private readonly prismaService: PrismaService
  ) {}

  getTransactionById(id: number) {
    return this.prismaService.transaction.findUnique({
      where: {
        id
      }
    });
  }

  createTransaction(data: Partial<Transaction>) {
    return this.prismaService.transaction.create({
      data: {
        status: data.status,
        token: data.token,
        amount: data.amount,
        userName: data.userName,
        payMethod: data.payMethod,
        rawData: data.rawData,
        serverId: data.serverId,
        planId: data.planId,
      },
      include: {
        server: true
      }
    });
  }

  getTransactionByWebpay(token: string) {
    return this.prismaService.transaction.findFirst({
      where: {
        token
      },
      include: {
        server: true,
      }
    })
  }

  getServerTransactions(
    serverId: number,
    startDat: Date,
    endDate: Date,
    status?: TransactionStatus
  ) {
    return this.prismaService.transaction
      .findMany({
        where: {
          serverId,
          status,
          createdAt: {
            gte: startDat,
            lt: endDate
          },
        }
      })
  }

  setTransaction(
    tokenWebPay: string,
    status: TransactionStatus,
    webpayTransaction?: WebPaySuccessData
  ) {
    return this.prismaService.transaction.update({
      where: {
        token: tokenWebPay
      },
      data: {
        status,
        rawData: webpayTransaction as never,
      }
    });
  }
}
