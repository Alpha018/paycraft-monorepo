// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HookController } from './controller/hook.controller';
import { SharedModule } from '../../shared/shared.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule,
    SharedModule,
    ClientsModule.register([
      {
        name: 'CORE_SERVICE',
        transport: Transport.GRPC,
        options: {
          url: 'localhost:3000',
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
        }
      },
    ]),
  ],
  providers: [],
  controllers: [
    HookController
  ],
  exports: [],
})
export class HookModule {}
