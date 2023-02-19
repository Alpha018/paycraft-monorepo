import { INestApplication, Injectable, OnModuleInit, Scope } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable({ scope: Scope.DEFAULT })
export class PrismaService extends PrismaClient implements OnModuleInit {

  models: string[] = [
    'Command',
    'Transaction',
    'Plan',
    'Server',
    'User',
  ];

  constructor() {
    super();
    // SoftDelete Middleware
    this.$use(async (params, next) => {
      if (this.models.includes(params.model)) {
        if (params.action == 'findUnique') {
          params.action = 'findFirst';
          params.args.where['deletedAt'] = null;
        }
        if (params.action == 'findMany') {
          if (params?.args?.where !== undefined) {
            if (params.args.where.deletedAt === undefined) {
              params.args.where['deletedAt'] = null;
            }
          } else {
            params['args'] = { where: { deletedAt: null } };
          }
        }
      }
      return next(params);
    });
    this.$use(async (params, next) => {
      if (this.models.includes(params.model)) {
        if (params.action == 'delete') {
          // Delete queries
          params.action = 'update';
          params.args['data'] = { deletedAt: new Date() };
        }
        if (params.action == 'deleteMany') {
          params.action = 'updateMany';
          if (params.args.data != undefined) {
            params.args.data['deletedAt'] = new Date();
          } else {
            params.args['data'] = { deletedAt: new Date() };
          }
        }
      }
      return next(params);
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
