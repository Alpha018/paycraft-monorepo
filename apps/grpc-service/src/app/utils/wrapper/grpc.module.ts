import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConnectionsName } from 'common';
import { GrpcConfigModule } from '../../config/grpc-config.module';
import { GrpcServiceConfig } from '../../config/grpc-service.config';
import { join } from 'path';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([{
      name: ConnectionsName.ConnectionName,
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
  exports: [ClientsModule],
})
export class GrpcModule {}
