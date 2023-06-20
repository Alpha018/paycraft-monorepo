import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RestServiceConfig {
  constructor(private config: ConfigService) {}

  get appConfig(): {
    nodeEnv: string
  } {
    return {
      nodeEnv: this.config.get('NODE_ENV')
    }
  }

  get applicationName(): string {
    return this.config.get<string>('APPLICATION_NAME');
  }

  get grpcConfigurations(): {
    url: string
  } {
    return {
      url: this.config.get<string>('CORE_SERVICE_GRPC'),
    }
  }

  get firebaseConfig(): {
    serviceAccount: string
  } {
    return {
      serviceAccount: Buffer.from(
          this.config.get<string>('SERVICE_ACCOUNT'),
          'base64'
        ).toString('binary')
    }
  }
}
