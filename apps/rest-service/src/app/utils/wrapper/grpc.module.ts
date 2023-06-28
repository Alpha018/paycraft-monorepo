import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConnectionsName } from 'common';
import { join } from 'path';
import { RestConfigModule } from '../../config/rest-config.module';
import { RestServiceConfig } from '../../config/rest-service.config';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([{
      name: ConnectionsName.ConnectionName,
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
  exports: [ClientsModule],
})
export class GrpcModule {}
