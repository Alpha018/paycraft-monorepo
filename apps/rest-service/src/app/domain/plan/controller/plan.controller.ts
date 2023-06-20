import { Controller, Get, Inject, Param, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GrpcConfigs } from 'common';
import { ClientGrpc } from '@nestjs/microservices';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { planController } from '../../proto-gen/service';
import { GetPlanByServerDto } from '../dto/plan.dto';
import { Request } from 'express';
import { lastValueFrom } from 'rxjs';

@Controller('plan')
export class PlanController {

  planController: planController;
  constructor(
    private readonly configService: ConfigService,
    @Inject(GrpcConfigs.ConnectionName) private client: ClientGrpc,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
    this.planController = this.client.getService<planController>('planController');
  }

  @Get('server/:id')
  getPlansByServer(
    @Param() params: GetPlanByServerDto,
    @Req() req: Request
  ) {
    return lastValueFrom(this.planController.getUsersPlans({
      serverReference: params.id,
      firebaseUid: req.user.firebase.uid
    }))
  }
}
