import { Controller, Inject, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConnectionsName } from 'common';
import { ClientGrpc, GrpcMethod } from '@nestjs/microservices';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { planController } from '../../proto-gen/service';
import { lastValueFrom } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';
import { GetPlanByServerDto } from '../dto/plan.dto';
import { GrpcAuthGuard } from '../../../shared/guard/grpc-auth.guard';

@Controller()
export class PlanController {

  planController: planController;
  constructor(
    private readonly configService: ConfigService,
    @Inject(ConnectionsName.ConnectionName) private client: ClientGrpc,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
    this.planController = this.client.getService<planController>('planController');
  }


  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('PlanController', 'getUsersPlans')
  getPlansByServer(params: GetPlanByServerDto, metadata: Metadata) {
    return lastValueFrom(this.planController.getUsersPlans({
      serverReference: params.serverReference,
      firebaseUid: metadata.get('firebaseUid')[0].toString()
    }))
  }
}
