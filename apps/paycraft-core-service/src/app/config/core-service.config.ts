import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CoreServiceConfig {
  constructor(private config: ConfigService) {}

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
}
