import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CoreServiceConfig {
  constructor(private config: ConfigService) {}

  get appConfig(): {
    nodeEnv: string
  } {
    return {
      nodeEnv: this.config.get('NODE_ENV')
    }
  }
  get databaseURL(): string {
    return this.config.get('DATABASE_URL');
  }

  get applicationName(): string {
    return this.config.get<string>('APPLICATION_NAME');
  }

  get firebaseConfiguration(): Record<string, unknown> {
    const jsonString = Buffer.from(
      this.config.get<string>('SERVICE_ACCOUNT'),
      'base64'
    ).toString('binary');
    return JSON.parse(jsonString)
  }

  get contentfulConfig(): {
    manageToken: string,
    spaceId: string,
    environmentId: string,
  } {
    return {
      manageToken: this.config.get<string>('CONTENTFUL_MANAGE_TOKEN'),
      spaceId: this.config.get<string>('CONTENTFUL_SPACE_ID'),
      environmentId: this.config.get<string>('CONTENTFUL_ENVIRONMENT_ID'),
    }
  }

  get redisConfiguration(): {
    url: string
  } {
    return {
      url: this.config.get<string>('REDIS_URL'),
    }
  }

  get transbankConfig(): {
    commerceCode: string,
    apiKey: string,
    returnUrl: string,
  } {
    return {
      commerceCode: this.config.get<string>('TBK_COMMERCE_CODE'),
      apiKey: this.config.get<string>('TBK_API_KEY'),
      returnUrl: this.config.get<string>('TBK_RETURN_URL'),
    }
  }
}
