import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PlanController } from './controller/plan.controller';
import { SharedModule } from '../../shared/shared.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GrpcConfigs } from 'common';
import { GrpcConfigModule } from '../../config/grpc-config.module';
import { GrpcServiceConfig } from '../../config/grpc-service.config';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule,
    SharedModule,
    ClientsModule.registerAsync([{
      name: GrpcConfigs.ConnectionName,
      imports: [GrpcConfigModule],
      useFactory: async (configService: GrpcServiceConfig) => ({
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
      inject: [GrpcServiceConfig],
    }]),
  ],
  providers: [],
  controllers: [
    PlanController
  ],
  exports: [],
})
export class PlanModule {}
