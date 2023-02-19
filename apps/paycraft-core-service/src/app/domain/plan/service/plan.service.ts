import { HttpException, Inject, Injectable } from '@nestjs/common';
import { PlanRepository } from '../repository/plan.repository';
import { CreatePlanDto, UpdatePlanDto } from '../dto/plan.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { UserRepository } from '../../user/repository/user.repository';
import { ServerRepository } from '../../server/repository/server.repository';
import { createWinstonContext } from 'utils';
import { ContentfulService } from '../../../shared/service/contentful.service';
import { NodeHtmlMarkdown } from 'node-html-markdown';
import { PrismaErrorHandler } from '../../handlers/handle-prisma-error';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { richTextFromMarkdown } = require('@contentful/rich-text-from-markdown');

@Injectable()
export class PlanService {
  constructor(
    private readonly planRepository: PlanRepository,
    private readonly serverRepository: ServerRepository,
    private readonly userRepository: UserRepository,
    private readonly contentfulService: ContentfulService,
    private readonly prismaErrorHandler: PrismaErrorHandler,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  async createUserPlan(plan: CreatePlanDto) {
    const meta = createWinstonContext(
      this.constructor.name,
      this.createUserPlan.name
    );

    const server = await this.getServersByFirebaseUser(
      plan.firebaseUid,
      plan.serverReference
    );

    if (!server) {
      this.logger.error('User don\'t have permission to create plan', {
        ...meta,
        userFirebase: plan.firebaseUid,
        server: plan.serverReference,
      });
      throw new HttpException('User don\'t have permission to create plan', 403);
    }

    let countPlans;
    try {
      countPlans = await this.planRepository.getPlansCounts(server.id);
    } catch (e) {
      this.prismaErrorHandler.handlePrismaErrors(e, this.createUserPlan.name)
    }

    if (countPlans >= server.maxPlans) {
      this.logger.error('This server cannot create by restricted plan counts', {
        ...meta,
        user: plan.firebaseUid,
        server: plan.serverReference,
      });
      throw new HttpException('Max plans achieved', 400);
    }

    try {
      return await this.planRepository.transactionCreatePlan(plan)
    } catch (e) {
      this.prismaErrorHandler.handlePrismaErrors(e, this.createUserPlan.name)
    }
  }

  async getUserPlans(firebaseUserUid: string, serverReference: number) {
    const meta = createWinstonContext(
      this.constructor.name,
      this.getUserPlans.name
    );

    const server = await this.getServersByFirebaseUser(
      firebaseUserUid,
      serverReference
    );

    if (!server) {
      this.logger.error('User don\'t have permission to get this server plans', {
        ...meta,
        userFirebase: firebaseUserUid,
        server: serverReference,
      });
      throw new HttpException('User don\'t have permission', 403);
    }

    try {
      return {
        data: await this.planRepository.getPlansByServerId(server.id)
      }
    } catch (e) {
      this.prismaErrorHandler.handlePrismaErrors(e, this.createUserPlan.name)
    }
  }

  async getPlanById(firebaseUserUid: string, planId: number) {
    const meta = createWinstonContext(
      this.constructor.name,
      this.getPlanById.name
    );

    this.logger.info('Init process to get plan by id', {
      ...meta,
      userFirebase: firebaseUserUid,
      plan: planId,
    });
    const { plan } = await this.getPlanByFirebaseUser(firebaseUserUid, planId);

    return plan;
  }

  async deletePlanByServerId(firebaseUserUid: string, planId: number) {
    const meta = createWinstonContext(
      this.constructor.name,
      this.deletePlanByServerId.name
    );

    this.logger.info('Init process to delete plan', {
      ...meta,
      userFirebase: firebaseUserUid,
      plan: planId,
    });
    const { plan } = await this.getPlanByFirebaseUser(firebaseUserUid, planId);

    await this.contentfulService.removeEntry(plan.contentfulId);
    return this.planRepository.deletePlanById(plan.id);
  }

  async updatePlanByServerId(
    planData: UpdatePlanDto
  ) {
    const meta = createWinstonContext(
      this.constructor.name,
      this.updatePlanByServerId.name
    );

    this.logger.info('Init process to update plan', {
      ...meta,
      userFirebase: planData.firebaseUid,
      plan: planData.id,
    });
    const { plan } = await this.getPlanByFirebaseUser(planData.firebaseUid, planData.id);

    let planDatabase;
    try {
      planDatabase = await this.planRepository.updatePlanById(plan.id, {
        amount: planData.amount,
        expireTime: planData.expireTime,
        expireUnit: planData.expireUnit,
        executeCommands: planData.executeCommands,
        expiredCommands: planData.expiredCommands,
      });
    } catch (e) {
      this.prismaErrorHandler.handlePrismaErrors(e, this.updatePlanByServerId.name)
    }

    try {
      const markDown = NodeHtmlMarkdown.translate(planData.description);
      const richText = await richTextFromMarkdown(markDown);
      await this.contentfulService.updateEntry(
        planDatabase.contentfulId,
        planData.title,
        richText
      );
      return planDatabase;
    } catch (e) {
      this.logger.error('Error in contentful service', {
        ...meta,
        contentfulId: planDatabase.contentfulId,
        error: e.message
      })
      throw new HttpException(
        'Error to save plan, contact to administrator',
        500
      );
    }
  }

  async getPlanByFirebaseUser(firebaseUserUid: string, planId: number) {
    const meta = createWinstonContext(
      this.constructor.name,
      this.getPlanByFirebaseUser.name
    );

    const serverList = await this.serverRepository.getServersByUser({
      firebaseId: firebaseUserUid
    });
    const plan = await this.planRepository.getPlanById(planId);

    if (!plan) {
      this.logger.error('User find plan, not found in database', {
        ...meta,
        userFirebase: firebaseUserUid,
        plan: planId,
      });
      throw new HttpException('Plan not found', 404);
    }

    if (
      !serverList.find(
        (data) => data.id === plan.serverId
      )
    ) {
      this.logger.error(
        'User don\'t have permission to get this plans in this server',
        {
          ...meta,
          userFirebase: firebaseUserUid,
          plan: planId,
        }
      );
      throw new HttpException('User don\'t have permission', 403);
    }

    return {
      serverList,
      plan,
    };
  }

  async getServersByFirebaseUser(
    firebaseUserUid: string,
    serverReference: number
  ) {
    const serverList = await this.serverRepository.getServersByUser({
      firebaseId: firebaseUserUid
    });
    return serverList.find((data) => data.id === serverReference);
  }
}
