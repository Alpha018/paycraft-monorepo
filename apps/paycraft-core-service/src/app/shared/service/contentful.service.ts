import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { createClient } from 'contentful-management';
import { CoreServiceConfig } from '../../config/core-service.config';
import { ContentfulPlan } from '../../domain/plan/interface/contentful';

@Injectable()
export class ContentfulService {
  client = createClient({
    accessToken: this.configService.contentfulConfig.manageToken,
  });

  constructor(
    private readonly configService: CoreServiceConfig,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  async createPlan(plan: ContentfulPlan) {
    let entry;

    entry = {
      fields: {
        planId: { 'es-CL': plan.planId.toString() },
        serverReference: { 'es-CL': plan.serverReference.toString() },
        title: { 'es-CL': plan.title },
        description: { 'es-CL': plan.description },
      },
    };

    const contentfulSpace = await this.client.getSpace(
      this.configService.contentfulConfig.spaceId
    );
    const contentfulEnv = await contentfulSpace.getEnvironment(
      this.configService.contentfulConfig.environmentId
    );
    entry = await contentfulEnv.createEntry('plan', entry);
    entry.publish();
    return entry;
  }

  async getEntry(entryId: string) {
    const contentfulSpace = await this.client.getSpace(
      this.configService.contentfulConfig.spaceId
    );
    const contentfulEnv = await contentfulSpace.getEnvironment(
      this.configService.contentfulConfig.environmentId
    );
    return contentfulEnv.getEntry(entryId);
  }

  async updateEntry(id: string, title: string, description: unknown) {
    const entry = await this.getEntry(id);
    entry.fields.title = {
      'es-CL': title,
    };
    entry.fields.description = {
      'es-CL': description,
    };
    const toPublish = await entry.update();
    return toPublish.publish();
  }

  async removeEntry(id: string) {
    const entry = await this.getEntry(id);
    const toRemove = await entry.unpublish();
    return toRemove.delete();
  }
}
