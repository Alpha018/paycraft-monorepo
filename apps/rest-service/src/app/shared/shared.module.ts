import { Global, Module } from '@nestjs/common';
import { AdminUserMiddleware } from './middleware/admin-user.middleware';
import { FirebaseService } from './service/firebase.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GrpcConfigs } from 'common';
import { RestConfigModule } from '../config/rest-config.module';
import { RestServiceConfig } from '../config/rest-service.config';
import { join } from 'path';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([{
      name: GrpcConfigs.ConnectionName,
      imports: [RestConfigModule],
      useFactory: async (configService: RestServiceConfig) => ({
        transport: Transport.GRPC,
        options: {
          url: configService.grpcConfigurations.url,
          package: 'core',
          protoPath: join(__dirname, '..', '..', 'libs', 'common', 'src', 'assets', 'proto', 'service.proto'),
          loader: {
            keepCase: true,
            longs: Number,
            enums: String,
            defaults: false,
            arrays: true,
            objects: true,
            includeDirs: [
              join(__dirname, '..', '..', 'libs', 'common', 'src', 'assets', 'proto')
            ],
          },
        },
      }),
      inject: [RestServiceConfig],
    }]),
  ],
  providers: [AdminUserMiddleware, FirebaseService],
  exports: [AdminUserMiddleware, FirebaseService],
})
export class SharedModule {}
