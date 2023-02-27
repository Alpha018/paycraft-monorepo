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

  get mongoConfig(): {
    url: string
  } {
    return {
      url: this.config.get<string>('MONGO_URL')
    }
  }

  get redisConfig(): {
    host: string,
    port: string,
  } {
    return {
      host: this.config.get<string>('REDIS_QUEUE_HOST'),
      port: this.config.get<string>('REDIS_QUEUE_PORT')
    }
  }
}
