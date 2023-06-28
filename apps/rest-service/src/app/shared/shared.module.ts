import { Global, Module } from '@nestjs/common';
import { AdminUserMiddleware } from './middleware/admin-user.middleware';
import { FirebaseService } from './service/firebase.service';

@Global()
@Module({
  imports: [],
  providers: [AdminUserMiddleware, FirebaseService],
  exports: [AdminUserMiddleware, FirebaseService],
})
export class SharedModule {}
