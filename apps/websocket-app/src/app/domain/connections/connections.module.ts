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
import { GrpcConfigs, QueueNames } from 'common';
import { WebsocketServiceConfig } from '../../config/websocket-service.config';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';

@Module({
  imports: [
    WebsocketConfigModule,
    MongooseModule.forFeature([
      { name: ConnectionSocket.name, schema: ConnectionSocketSchema },
    ]),
    BullModule.registerQueue({
      name: QueueNames.Transaction,
    }),
    BullBoardModule.forFeature({
      name: QueueNames.Transaction,
      adapter: BullMQAdapter,
    }),
    ClientsModule.registerAsync([{
      name: GrpcConfigs.ConnectionName,
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
