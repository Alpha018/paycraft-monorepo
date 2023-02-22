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

  get bigCommerceConfig(): {
    storeId: string,
    accessToken: string,
  } {
    return {
      storeId: this.config.get('BIGCOMMERCE_STORE_ID'),
      accessToken: this.config.get('BIGCOMMERCE_ACCESS_TOKEN'),
    }
  }
}
