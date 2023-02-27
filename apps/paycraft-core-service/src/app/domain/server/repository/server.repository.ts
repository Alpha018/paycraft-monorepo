import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaErrorHandler } from '../../handlers/handle-prisma-error';
import { HandleFirebaseError } from '../../handlers/handle-firebase-error';
import { CreateServerDto } from '../dto/server.dto';
import { PrismaService } from '../../../prisma.service';
import { UserServer } from '@prisma/client';

@Injectable()
export class ServerRepository {
  constructor(
    private readonly prismaErrorHandler: PrismaErrorHandler,
    private readonly handleFirebaseError: HandleFirebaseError,
    private readonly prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
  }

  createServer(server: CreateServerDto, serverToken: string) {
    return this.prismaService.server.create({
      data: {
        ...server,
        serverToken,
      }
    })
  }

  getServerByServer(params: {
    id?: number;
    serverToken?: string;
  }) {
    return this.prismaService.server.findFirst({
      where: {
        OR: [{
          serverToken: params.serverToken
        }, {
          id: params.id
        }]
      }
    });
  }

  deleteOnlineUsersByServer(id: number) {
    return this.prismaService.userServer.deleteMany({
      where: {
        serverId: id
      }
    });
  }

  updateOnlineUsersByServer(id: number, onlineUsers: Partial<UserServer>[]) {
    return this.prismaService.server.update({
      where: {
        id
      },
      data: {
        onlinePlayers: {
          create: onlineUsers.map((data) => ({
            displayName: data.displayName,
            uniqueId: data.uniqueId
          }))
        }
      }
    })
  }

  getServersByUser(params: {
    adminId?: number;
    firebaseId?: string;
  }) {
    return this.prismaService.server.findMany({
      where: {
        admin: {
          OR: [{
            firebaseUid: params.firebaseId
          }, {
            id: params.adminId
          }]
        }
      }
    });
  }
}
