import { Inject, Injectable } from '@nestjs/common';
import { ConnectionSocketRepository } from '../repository/connection-socket.repository';
import { Server, Socket } from 'socket.io';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { createWinstonContext } from 'utils';
import { Topics, UserList } from '../model/connection-socket.model';
import dayjs, { ManipulateType } from 'dayjs';
import { AgendaCommandService } from './agenda-command.service';
import { ClientGrpc } from '@nestjs/microservices';
import { CommandController, planController, serverController } from '../proto-gen/service';
import { CommandStatus } from '@prisma/client'
import { command } from '../proto-gen/response/command';
import { lastValueFrom } from 'rxjs';
import { ConnectionsName } from 'common';

export enum TypeCommandExecuted {
  EXECUTED = 'executedCommand',
  EXPIRED = 'expiredCommand',
}

@Injectable()
export class ConnectionSocketService {
  _server: Server;
  private serverController: serverController;
  private commandService: CommandController;
  private planService: planController;

  constructor(
    private readonly connectionRepository: ConnectionSocketRepository,
    private readonly agenda: AgendaCommandService,
    @Inject(ConnectionsName.ConnectionName) private client: ClientGrpc,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
    this.serverController = this.client.getService<serverController>('serverController');
    this.commandService = this.client.getService<CommandController>('CommandController');
    this.planService = this.client.getService<planController>('planController');
  }

  get server(): Server {
    return this._server;
  }

  set server(server: Server) {
    this._server = server;
  }

  async verifyConnection(client: Socket, connectionId: string) {
    const meta = createWinstonContext(
      this.constructor.name,
      this.verifyConnection.name
    );

    const token = client.handshake.query.token as string;
    if (!token) {
      this.logger.error('Invalid credentials.', { ...meta, userId: client.id });
      client.disconnect();
      return;
    }

    const connection = await this.connectionRepository.findConnectionByToken(
      token
    );

    if (connection) {
      this.logger.error('Exist Connection.', { ...meta, userId: client.id });
      client.disconnect();
      return;
    }

    const server = await this.serverController.getServer({
      serverToken: token
    });

    if (!server) {
      this.logger.error('Try connection, server not exist', {
        ...meta,
        userId: client.id
      });
      client.disconnect();
      return;
    }

    try {
      await this.connectionRepository.createConnection({
        connectionId,
        serverToken: token
      });
      await this.sendDataToServerConnection(token);
      return;
    } catch (e) {
      this.logger.error('Problem with create connection', {
        ...meta,
        userId: client.id,
        error: e.message
      });
      client.disconnect();
    }
  }

  async closeConnection(client: Socket) {
    const meta = createWinstonContext(
      this.constructor.name,
      this.closeConnection.name
    );
    const token = client.handshake.query.token as string;

    const connection = await this.connectionRepository.findConnectionByUserId(
      token,
      client.id
    );

    if (!connection) {
      this.logger.error('Error in close connection, connection not exist', {
        ...meta,
        userId: client.id
      });
      return;
    }

    try {
      await this.connectionRepository.closeConnection(token);
    } catch (e) {
      this.logger.error('Problem in close connection', {
        ...meta,
        userId: client.id,
        error: e.message
      });
    }
  }

  async closeAllConnections() {
    const meta = createWinstonContext(
      this.constructor.name,
      this.closeAllConnections.name
    );

    const connections =
      await this.connectionRepository.getAllActiveConnections();

    this.logger.info('Init process to close all connections', { ...meta });
    let i = 0;
    for (const connection of connections) {
      try {
        await this.connectionRepository.closeConnectionById(connection._id);
        i++;
      } catch (e) {
        this.logger.error('Error in close connection', {
          ...meta,
          id: connection._id
        });
      }
    }
    this.logger.info('Close All connections', { ...meta, connections: i });
  }

  async sendDataToServerConnection(serverToken: string) {
    const meta = createWinstonContext(
      this.constructor.name,
      this.sendDataToServerConnection.name
    );

    this.logger.info('Getting connection to send commands', { ...meta });
    const connection = await this.connectionRepository.findConnectionByToken(
      serverToken
    );

    if (!connection) {
      this.logger.error('Connection not exist, data to server', {
        ...meta,
        serverToken
      });
      return;
    }

    this.logger.info('Getting Pending command in socket connection', {
      ...meta
    });
    const { items: commands } = await lastValueFrom(this.commandService.getPendingToSendTransaction({
      serverToken
    }));

    const { items: commandsExpired } =
      await lastValueFrom(this.commandService.getExpiredToSendTransaction({
        serverToken
      }));

    for (const command of commands) {
      this.server.to(connection.connectionId).emit(Topics.SEND_COMMANDS, {
        execute: this.generateObjectCommand(command),
        expired: {}
      });
      await this.commandService.changeCommandToSend({
        id: command.id
      });
    }

    for (const command of commandsExpired) {
      this.server.to(connection.connectionId).emit(Topics.SEND_COMMANDS, {
        execute: {},
        expired: this.generateObjectCommand(command, true)
      });
      await this.commandService.changeCommandToSendExpired({
        id: command.id
      });
    }
  }

  async sendCommandToServerHook(serverToken: string, commandId: number) {
    const meta = createWinstonContext(
      this.constructor.name,
      this.sendCommandToServerHook.name
    );

    this.logger.info('Sending command to server connect', { ...meta });
    const connection = await this.connectionRepository.findConnectionByToken(
      serverToken
    );

    if (!connection) {
      this.logger.error('Connection not exist now', { ...meta, serverToken });
      return;
    }

    this.logger.info('Getting command to send in socket connection', {
      ...meta
    });
    const command = await lastValueFrom(this.commandService.getCommandById({
      id: commandId
    }));

    if (!command) {
      this.logger.error('Command not exist', { ...meta, commandId });
      return;
    }

    this.server.to(connection.connectionId).emit(Topics.SEND_COMMANDS, {
      execute: this.generateObjectCommand(command),
      expired: {}
    });
    await this.commandService.changeCommandToSend({
      id: command.id
    });
  }

  async putUsersOnline(users: UserList[], clientId: string) {
    const meta = createWinstonContext(
      this.constructor.name,
      this.putUsersOnline.name
    );

    this.logger.info('Getting connection by client id to put user data', {
      ...meta,
      clientId
    });
    const connection = await this.connectionRepository.findConnectionByClientId(
      clientId
    );

    if (!connection) {
      this.logger.error('Connection not exist', { ...meta, clientId });
      return;
    }

    const server = await lastValueFrom(this.serverController.getServer({
      serverToken: connection.serverToken
    }));

    if (!users || users.length === 0) {
      await lastValueFrom(this.serverController.setUsersServer({
        serverId: server.server.id,
        onlineUsers: []
      }))
      return;
    }

    await lastValueFrom(this.serverController.setUsersServer({
      serverId: server.server.id,
      onlineUsers: users
        .filter((data) => data.userName && data.uid)
        .map((data) => {
          return {
            uniqueId: data.uid,
            displayName: data.userName
          };
        })
    }));
  }

  async setCommandToDone(
    commandInput: { id: number; type: TypeCommandExecuted },
    clientId: string
  ) {
    const meta = createWinstonContext(
      this.constructor.name,
      this.setCommandToDone.name
    );

    this.logger.info('Getting connection by client id', { ...meta, clientId });
    const connection = await this.connectionRepository.findConnectionByClientId(
      clientId
    );

    if (!connection) {
      this.logger.error('Connection not exist', { ...meta, clientId });
      return;
    }

    const server = await lastValueFrom(this.serverController.getServer({
      serverToken: connection.serverToken
    }));

    let command;
    if (commandInput.type === TypeCommandExecuted.EXECUTED) {
      this.logger.info('Getting command by id to set done', { ...meta });
      command = await this.commandService.getCommandById({
        id: commandInput.id,
        status: CommandStatus.SEND
      });

      const plan = await lastValueFrom(this.planService.getPlanById(command.planReference));

      if (plan) {
        await lastValueFrom(this.commandService.changeExpireDate({
          id: command.id,
          expireDate: dayjs()
            .add(plan.expireTime, plan.expireUnit.toLowerCase() as ManipulateType)
            .toISOString()
        }))
        await this.agenda.createExpiredJob(command.expireDate, command.id);
      }
    } else if (commandInput.type === TypeCommandExecuted.EXPIRED) {
      this.logger.info('Getting command by id to set expired', { ...meta });
      command = await lastValueFrom(this.commandService.getCommandById({
        id: commandInput.id,
        status: CommandStatus.SEND_EXPIRED
      }));
    }

    if (
      !command ||
      server.server.id.toString() !== command.serverReference.toString()
    ) {
      this.logger.error('Command not exist or client is not the same', {
        ...meta,
        commandId: commandInput.id
      });
      return;
    }

    await this.commandService.changeCommandStatus({
      id:command.id,
      type:commandInput.type === TypeCommandExecuted.EXECUTED
        ? CommandStatus.DONE
        : CommandStatus.EXPIRED
    });
  }

  async sendExpiredCommandHook(commandId: number) {
    const meta = createWinstonContext(
      this.constructor.name,
      this.sendExpiredCommandHook.name
    );

    const command = await lastValueFrom(this.commandService.getCommandById({
      id: commandId,
      status: CommandStatus.DONE
    }));

    if (!command) {
      this.logger.error(
        'Command not exist, this problem is estrange, view this command',
        { ...meta, commandId }
      );
      return;
    }

    const server = await this.serverController.getServer({
      id: command.transaction.serverId
    });

    if (!server) {
      this.logger.error(
        'Server not exist, this problem is estrange, view this command',
        { ...meta, commandId }
      );
      return;
    }

    const connection = await this.connectionRepository.findConnectionByToken(
      command.transaction.server.serverToken
    );

    if (!connection) {
      this.logger.error('Connection not exist now', { ...meta, commandId });
      return;
    }

    this.server.to(connection.connectionId).emit(Topics.SEND_COMMANDS, {
      execute: {},
      expired: this.generateObjectCommand(command, true)
    });
    await this.commandService.changeCommandStatus({
      id: command.id,
      type: CommandStatus.SEND_EXPIRED
    });
  }

  generateObjectCommand(data: command, expired = false) {
    if (expired) {
      return {
        id: data.id,
        commands: data.expiredCommands,
        userName: data.userName
      };
    }
    return {
      id: data.id,
      commands: data.executeCommands,
      userName: data.userName
    };
  }
}
