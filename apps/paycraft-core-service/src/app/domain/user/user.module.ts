import { Module } from '@nestjs/common';

import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { UserRepository } from './repository/user.repository';
import { PrismaService } from '../../prisma.service';
import { HandleModule } from '../handlers/handle.module';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [
    HandleModule,
    SharedModule
  ],
  controllers: [
    UserController
  ],
  providers: [
    UserService,
    UserRepository,
    PrismaService,
  ],
  exports: [
    UserService,
    UserRepository
  ]
})
export class UserModule {}
