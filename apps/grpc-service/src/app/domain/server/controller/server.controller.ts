import { Controller, Inject, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConnectionsName } from 'common';
import { ClientGrpc, GrpcMethod } from '@nestjs/microservices';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { serverController } from '../../proto-gen/service';
import { lastValueFrom } from 'rxjs';
import { GrpcAuthGuard } from '../../../shared/guard/grpc-auth.guard';
import { Metadata } from '@grpc/grpc-js';

@Controller()
export class ServerController {

  serverController: serverController;
  constructor(
    private readonly configService: ConfigService,
    @Inject(ConnectionsName.ConnectionName) private client: ClientGrpc,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
    this.serverController = this.client.getService<serverController>('serverController');
  }

  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('ServerController', 'getServersByUser')
  getServersByUser(params: unknown, metadata: Metadata) {
    return lastValueFrom(this.serverController.getServersByUser({
      firebaseUid: metadata.get('firebaseUid')[0].toString(),
    }))
  }
}
