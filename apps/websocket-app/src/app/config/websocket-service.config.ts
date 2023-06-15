import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WebsocketServiceConfig {
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

  get redisConfiguration(): {
    url: string
  } {
    return {
      url: this.config.get<string>('REDIS_URL'),
    }
  }

  get mongoConfiguration(): {
    url: string
  } {
    return {
      url: this.config.get<string>('MONGO_URL'),
    }
  }

  get grpcConfigurations(): {
    url: string
  } {
    return {
      url: this.config.get<string>('CORE_SERVICE_GRPC'),
    }
  }
}
