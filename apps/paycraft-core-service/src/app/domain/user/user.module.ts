import { Module } from '@nestjs/common';

import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { UserRepository } from './repository/user.repository';
import { PrismaService } from '../../prisma.service';
import { FirebaseService } from '../../shared/service/firebase.service';
import { CoreConfigModule } from '../../config/core-config.module';
import { HandleModule } from '../handlers/handle.module';

@Module({
  imports: [
    HandleModule,
    CoreConfigModule
  ],
  controllers: [
    UserController
  ],
  providers: [
    UserService,
    UserRepository,
    PrismaService,
    FirebaseService
  ],
})
export class UserModule {}
