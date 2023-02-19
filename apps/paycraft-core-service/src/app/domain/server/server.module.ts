import { Module } from '@nestjs/common';

import { PrismaService } from '../../prisma.service';
import { CoreConfigModule } from '../../config/core-config.module';
import { HandleModule } from '../handlers/handle.module';
import { ServerService } from './service/server.service';
import { ServerController } from './controller/server.controller';
import { ServerRepository } from './repository/server.repository';

@Module({
  imports: [
    HandleModule,
    CoreConfigModule,
  ],
  controllers: [
    ServerController
  ],
  providers: [
    ServerService,
    ServerRepository,
    PrismaService,
  ],
  exports: [
    ServerService,
    ServerRepository
  ]
})
export class ServerModule {}
