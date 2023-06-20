import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TransactionController } from './controller/transaction.controller';
import { SharedModule } from '../../shared/shared.module';
import { ClientsModule, Transport } from "@nestjs/microservices";
import { GrpcConfigs } from "common";
import { RestConfigModule } from "../../config/rest-config.module";
import { RestServiceConfig } from "../../config/rest-service.config";
import { join } from "path";

@Module({
  imports: [
    ConfigModule,
    SharedModule,
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
  providers: [],
  controllers: [
    TransactionController
  ],
  exports: [],
})
export class TransactionModule {}
