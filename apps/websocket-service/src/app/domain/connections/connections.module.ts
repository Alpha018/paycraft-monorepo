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
import { BullModule } from '@nestjs/bull';
import { TransactionProcessor } from './processors/transaction.processor';

@Module({
  imports: [
    WebsocketConfigModule,
    MongooseModule.forFeature([
      { name: ConnectionSocket.name, schema: ConnectionSocketSchema },
    ]),
    BullModule.registerQueue({
      name: 'TRANSACTION',
    }),
    ClientsModule.register([
      {
        name: 'CORE_SERVICE',
        transport: Transport.GRPC,
        options: {
          url: 'localhost:3000',
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
        }
      },
    ]),
  ],
  providers: [
    AppGateway,
    ConnectionSocketRepository,
    ConnectionSocketService,
    AgendaCommandService,
    TransactionProcessor
  ],
  exports: [
    ConnectionSocketService,
    ConnectionSocketRepository
  ],
})
export class ConnectionsModule {}
