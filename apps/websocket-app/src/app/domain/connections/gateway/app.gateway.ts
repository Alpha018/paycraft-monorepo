import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Inject } from '@nestjs/common';
import { Logger } from 'winston';
import { Server, Socket } from 'socket.io';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import {
  ConnectionSocketService,
  TypeCommandExecuted,
} from '../service/connection-socket.service';
import { Topics, UserList } from '../model/connection-socket.model';

@WebSocketGateway(4000, {
  transports: ['websocket']
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly connectionService: ConnectionSocketService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
    this.connectionService.closeAllConnections().then();
  }

  async afterInit(): Promise<void> {
    this.connectionService.server = this.server;
  }

  async handleConnection(client: Socket): Promise<void> {
    return await this.connectionService.verifyConnection(client, client.id);
  }

  async handleDisconnect(client: Socket): Promise<void> {
    return await this.connectionService.closeConnection(client);
  }

  @SubscribeMessage(Topics.COMMAND_EXECUTED)
  async handleEvent(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket
  ): Promise<void> {
    return await this.connectionService.setCommandToDone(
      JSON.parse(data) as { id: number; type: TypeCommandExecuted },
      client.id
    );
  }

  @SubscribeMessage(Topics.USERS_INFORMATION)
  async handleEventUsers(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket
  ): Promise<void> {
    return await this.connectionService.putUsersOnline(
      JSON.parse(data) as UserList[],
      client.id
    );
  }
}
