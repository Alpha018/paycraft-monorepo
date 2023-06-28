import { Module } from '@nestjs/common';
import { AppGateway } from './gateway/app.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ConnectionSocket,
  ConnectionSocketSchema,
} from './model/connection-socket.model';
import { ConnectionSocketService } from './service/connection-socket.service';
import { ConnectionSocketRepository } from './repository/connection-socket.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { WebsocketConfigModule } from '../../config/websocket-config.module';
import { AgendaCommandService } from './service/agenda-command.service';
import { TransactionProcessor } from './processors/transaction.processor';
import { ConnectionsName } from 'common';
import { WebsocketServiceConfig } from '../../config/websocket-service.config';

@Module({
  imports: [
    WebsocketConfigModule,
    MongooseModule.forFeature([
      { name: ConnectionSocket.name, schema: ConnectionSocketSchema },
    ]),
    ClientsModule.registerAsync([{
      name: ConnectionsName.ConnectionName,
      imports: [WebsocketConfigModule],
      useFactory: async (configService: WebsocketServiceConfig) => ({
        transport: Transport.GRPC,
        options: {
          url: configService.grpcConfigurations.url,
          package: 'core',
          protoPath: join(__dirname, '..', '..', 'libs', 'common', 'src', 'assets', 'proto', 'service.proto'),
          loader: {
            keepCase: true,
            longs: Number,
            enums: String,
            defaults: false,
            arrays: true,
            objects: true,
            includeDirs: [
              join(__dirname, '..', '..', 'libs', 'common', 'src', 'assets', 'proto')
            ],
          },
        },
      }),
      inject: [WebsocketServiceConfig],
    }]),
  ],
  controllers: [
    TransactionProcessor
  ],
  providers: [
    AppGateway,
    ConnectionSocketRepository,
    ConnectionSocketService,
    AgendaCommandService
  ],
  exports: [
    ConnectionSocketService,
    ConnectionSocketRepository
  ],
})
export class ConnectionsModule {}
