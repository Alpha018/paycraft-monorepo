import { Controller } from '@nestjs/common';
import { PlanService } from '../service/plan.service';
import { CreatePlanDto, GetPlansByUser, GetPlansUser, UpdatePlanDto } from '../dto/plan.dto';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @GrpcMethod('planController', 'getUsersPlans')
  getUsersPlans(query: GetPlansUser) {
    return this.planService.getUserPlans(
      query.firebaseUid,
      query.serverReference
    );
  }

  @GrpcMethod('planController', 'getPlanById')
  getPlanById(data: GetPlansByUser) {
    return this.planService.getPlanById(data.firebaseUid, data.id);
  }

  @GrpcMethod('planController', 'createPlan')
  createPlan(body: CreatePlanDto) {
    return this.planService.createUserPlan(body);
  }

  @GrpcMethod('planController', 'updateUsersPlanById')
  updateUsersPlanById(
    body: UpdatePlanDto,
  ) {
    return this.planService.updatePlanByServerId(body);
  }

  @GrpcMethod('planController', 'deleteUsersPlanById')
  deleteUsersPlanById(data: GetPlansByUser) {
    return this.planService.deletePlanByServerId(data.firebaseUid, data.id);
  }
}
