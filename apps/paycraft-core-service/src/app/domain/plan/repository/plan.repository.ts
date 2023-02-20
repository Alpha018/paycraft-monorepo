import { Inject, Injectable } from '@nestjs/common';
import { CreatePlanDto } from '../dto/plan.dto';
import { PrismaService } from '../../../prisma.service';
import { NodeHtmlMarkdown } from 'node-html-markdown';
import { ContentfulService } from '../../../shared/service/contentful.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { createWinstonContext } from 'utils';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { richTextFromMarkdown } = require('@contentful/rich-text-from-markdown');

@Injectable()
export class PlanRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly contentfulService: ContentfulService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  createPlan(plan: Partial<CreatePlanDto>) {
    return this.prismaService.plan.create({
      data: {
        serverId: plan.serverReference,
        amount: plan.amount,
        expireTime: plan.expireTime,
        expireUnit: plan.expireUnit,
        executeCommands: {
          create: plan.executeCommands
        },
        expiredCommands: {
          create: plan.expiredCommands
        }
      }
    })
  }

  getPlanById(id: number) {
    return this.prismaService.plan
      .findUnique({
        where: {
          id
        },
        include: {
          executeCommands: true,
          expiredCommands: true,
        }
      });
  }

  getPlansByServerId(serverId: number) {
    return this.prismaService.plan.findMany({
      where: {
        server: {
          id: serverId
        }
      }
    });
  }

  getPlansCounts(serverId: number) {
    return this.prismaService.plan.count({
      where: {
        server: {
          id: serverId
        },
        deletedAt: null
      }
    });
  }

  updatePlanById(id: number, plan) {
    return this.prismaService.plan.update({
      where: {
        id,
      },
      data: {
        ...plan,
        executeCommands: {
          deleteMany: {},
          createMany: {
            data: plan.executeCommands
          }
        },
        expiredCommands: {
          deleteMany: {},
          createMany: {
            data: plan.expiredCommands
          }
        }
      }
    });
  }

  removeAllCommands(id: number) {
    return this.prismaService.commandTemplate.deleteMany({
      where: {
        OR: [{
          commandExpiredId: id
        }, {
          commandExecuteId: id
        }]
      },
    });
  }

  transactionCreatePlan(
    planDatabase: CreatePlanDto
  ) {
    const meta = createWinstonContext(
      this.constructor.name,
      this.transactionCreatePlan.name
    );

    return this.prismaService.$transaction(async (transaction) => {
      try {
        const savePlan = await transaction.plan.create({
          data: {
            expireTime: planDatabase.expireTime,
            expireUnit: planDatabase.expireUnit,
            amount: planDatabase.amount,
            serverId: planDatabase.serverReference,
            executeCommands: {
              create: planDatabase.executeCommands
            },
            expiredCommands: {
              create: planDatabase.expiredCommands
            }
          }
        });

        const markDown = NodeHtmlMarkdown.translate(planDatabase.description);
        const richText = await richTextFromMarkdown(markDown);
        const entry = await this.contentfulService.createPlan({
          planId: savePlan.id,
          serverReference: planDatabase.serverReference,
          description: richText,
          title: planDatabase.title,
        });

        return transaction.plan.update({
          where: {
            id: savePlan.id
          },
          data: {
            contentfulId: entry.sys.id
          }
        });
      } catch (e) {
        this.logger.error('Error in transaction to create plan', {
          ...meta,
          error: e.message
        })
        throw e
      }
    })
  }

  deletePlanById(id: number) {
    return this.prismaService.plan.delete({
      where: {
        id
      }
    });
  }
}
