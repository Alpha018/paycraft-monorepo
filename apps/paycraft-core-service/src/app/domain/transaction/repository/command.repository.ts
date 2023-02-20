import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { Command, CommandLine, CommandStatus } from '@prisma/client'

@Injectable()
export class CommandRepository {
  constructor(
    private readonly prismaService: PrismaService
  ) {}

  createCommand(
    data: Partial<Command>,
    executeCommands: Partial<CommandLine>[],
    expiredCommands: Partial<CommandLine>[]
  ) {
    return this.prismaService.command.create({
      data: {
        status: data.status,
        transaction: {
          connect: {
            id: data.transactionId
          }
        },
        userName: data.userName,
        expireDate: data.expireDate,
        executeCommands: {
          create: executeCommands.map((data) => ({
            command: data.command,
            requiredOnline: data.requiredOnline
          }))
        },
        expiredCommands: {
          create: expiredCommands.map((data) => ({
            command: data.command,
            requiredOnline: data.requiredOnline
          }))
        }
      }
    })
  }

  getPendingCommandOfServer(params: {
    id?: number;
    serverToken?: string;
  }) {
    return this.prismaService.command.findMany({
      where: {
        OR: [{
          id: params.id,
        }, {
          transaction: {
            server: {
              serverToken: params.serverToken
            }
          }
        }],
        status: CommandStatus.STARTED,
      }
    });
  }

  getExpiredCommandOfServer(params: {
    id?: number;
    serverToken?: string;
  }) {
    return this.prismaService.command.findMany({
      where: {
        OR: [{
          id: params.id,
        }, {
          transaction: {
            server: {
              serverToken: params.serverToken
            }
          }
        }],
        status: CommandStatus.DONE,
        expireDate: {
          lte: new Date(),
        },
      }
    });
  }

  getCommandById(
    id: number,
    status: CommandStatus = CommandStatus.STARTED
  ) {
    return this.prismaService.command.findFirst({
      where: {
        id: id,
        status
      }
    });
  }

  changeCommandStatus(
    id: number,
    status: CommandStatus
  ) {
    return this.prismaService.command.update({
      where: {
        id
      },
      data: {
        status
      }
    });
  }

  getCommandDate(
    serverId: number,
    startDat: Date,
    endDate: Date,
    status?: CommandStatus
  ) {
    return this.prismaService.command.findMany({
      where: {
        status,
        transaction: {
          serverId
        },
        createdAt: {
          gte: startDat,
          lt: endDate,
        }
      },
      include: {
        transaction: true
      }
    });
  }
}
