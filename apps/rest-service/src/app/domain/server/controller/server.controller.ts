import { Controller, Get, Inject, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GrpcConfigs } from 'common';
import { ClientGrpc } from '@nestjs/microservices';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { serverController } from '../../proto-gen/service';
import { Request } from 'express';
import { lastValueFrom } from 'rxjs';

@Controller('server')
export class ServerController {

  serverController: serverController;
  constructor(
    private readonly configService: ConfigService,
    @Inject(GrpcConfigs.ConnectionName) private client: ClientGrpc,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
    this.serverController = this.client.getService<serverController>('serverController');
  }

  @Get()
  getServersByUser(@Req() req: Request) {
    return lastValueFrom(this.serverController.getServersByUser({
      firebaseUid: req.user.firebase.uid,
    }))
  }
}
