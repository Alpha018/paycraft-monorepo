import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { createWinstonContext } from 'utils';
import { CoreServiceConfig } from '../../config/core-service.config';
import Ably from 'ably/callbacks';
import { AblyConstant } from 'common';

@Injectable()
export class AblyService implements OnModuleInit {
  ably: Ably.Rest;

  constructor(
    private readonly configService: CoreServiceConfig,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  onModuleInit(): void {
    this.ably = new Ably.Rest(this.configService.ablyConfigs.token);
  }

  sendToQueue(name: string, message: Record<string, unknown>) {
    const meta = createWinstonContext(
      this.constructor.name,
      this.sendToQueue.name
    );

    this.logger.info('Sending message to Ably', {
      ...meta,
      message
    })
    const channel = this.ably.channels.get(AblyConstant.ChannelName);
    return channel.publish(name, message);
  }
}
