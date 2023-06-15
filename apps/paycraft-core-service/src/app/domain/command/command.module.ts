import { Module } from '@nestjs/common';
import { CommandService } from './service/command.service';
import { CommandController } from './controller/command.controller';
import { CommandRepository } from './repository/command.repository';
import { HandleModule } from '../handlers/handle.module';
import { CoreConfigModule } from '../../config/core-config.module';
import { PrismaService } from '../../prisma.service';

@Module({
  imports: [
    HandleModule,
    CoreConfigModule,
  ],
  controllers: [
    CommandController
  ],
  providers: [
    PrismaService,
    CommandRepository,
    CommandService,
  ],
  exports: [
  ]
})
export class CommandModule {}
