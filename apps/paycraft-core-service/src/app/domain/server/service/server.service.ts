import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaErrorHandler } from '../../handlers/handle-prisma-error';
import { HandleFirebaseError } from '../../handlers/handle-firebase-error';
import { CreateServerDto, OnlineUsersDto, ServerQuery, ServerUserQuery } from "../dto/server.dto";
import { createWinstonContext } from 'utils';
import { ServerRepository } from '../repository/server.repository';
import { nanoid } from 'nanoid'

@Injectable()
export class ServerService {
  constructor(
    private readonly prismaErrorHandler: PrismaErrorHandler,
    private readonly handleFirebaseError: HandleFirebaseError,
    private readonly serverRepository: ServerRepository,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
  }

  async createServer(serverData: CreateServerDto) {
    const meta = createWinstonContext(
      this.constructor.name,
      this.createServer.name
    );

    this.logger.info('Creating server', { ...meta });

    const serverToken = nanoid(20);
    let server;
    try {
      server = await this.serverRepository.createServer({
        ...serverData
      }, `PayCraft-${serverToken}`);
    } catch (e) {
      this.prismaErrorHandler.handlePrismaErrors(e, this.createServer.name)
    }

    this.logger.info('Server created!!', {
      ...meta,
      token: server.serverToken,
      server,
    });
    return server;
  }

  async getUserServers(query: ServerUserQuery) {
    const meta = createWinstonContext(
      this.constructor.name,
      this.getUserServers.name
    );

    this.logger.info('Getting server Info', { ...meta });

    let servers;
    try {
      servers = await this.serverRepository.getServersByUser({
        adminId: query.id,
        firebaseId: query.firebaseUid
      });
    } catch (e) {
      this.prismaErrorHandler.handlePrismaErrors(e, this.createServer.name)
    }

    return { servers };
  }

  async getServer(query: ServerQuery) {
    const meta = createWinstonContext(
      this.constructor.name,
      this.getServer.name
    );

    this.logger.info('Getting server Info', { ...meta });

    let server;
    try {
      server = await this.serverRepository.getServerByServer({
        id: query.id,
        serverToken: query.serverToken
      });
    } catch (e) {
      this.prismaErrorHandler.handlePrismaErrors(e, this.createServer.name)
    }

    return { server };
  }

  async setUsersServer(data: OnlineUsersDto) {
    const meta = createWinstonContext(
      this.constructor.name,
      this.setUsersServer.name
    );

    this.logger.info('Setting information from online users', {
      ...meta,
      serverToken: data.serverId
    });

    let server;
    try {
      await this.serverRepository.deleteOnlineUsersByServer(data.serverId)
      server = await this.serverRepository.updateOnlineUsersByServer(
        data.serverId,
        data.onlineUsers
      );
    } catch (e) {
      this.prismaErrorHandler.handlePrismaErrors(e, this.createServer.name)
    }

    return { server };
  }
}
