import { Module } from '@nestjs/common';
import { FirebaseService } from './service/firebase.service';
import { GrpcAuthGuard } from './guard/grpc-auth.guard';


@Module({
  imports: [],
  providers: [
    FirebaseService,
    GrpcAuthGuard
  ],
  exports: [
    FirebaseService,
    GrpcAuthGuard
  ]
})
export class SharedModule {}
