import { Module } from '@nestjs/common';

import { PrismaErrorHandler } from './handle-prisma-error';
import { HandleFirebaseError } from './handle-firebase-error';

@Module({
  providers: [
    PrismaErrorHandler,
    HandleFirebaseError
  ],
  exports: [
    PrismaErrorHandler,
    HandleFirebaseError
  ]
})
export class HandleModule {}
