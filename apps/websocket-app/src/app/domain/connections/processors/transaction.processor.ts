import { ConnectionSocketService } from '../service/connection-socket.service';
import { Controller, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { createWinstonContext } from 'utils';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { AblyConstant } from 'common';
import { Data, MessageMQ } from '../interface/transaction.interface';

@Controller()
export class TransactionProcessor {

  constructor(
    private readonly connectionSocketService: ConnectionSocketService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
  }

  @EventPattern()
  async receiveEvent(@Payload() data: MessageMQ, @Ctx() context: RmqContext) {
    const meta = createWinstonContext(
      this.constructor.name,
      this.receiveEvent.name
    );

    if (data.channel !== AblyConstant.ChannelName) {
      this.logger.info('Getting message from other channel', {
        ...meta,
        data
      })
      return;
    }

    const queueMessage = {
      ...data.messages[0],
      data: JSON.parse(data.messages[0].data) as Data
    }

    this.logger.info('Getting information from bull queue', {
      ...meta,
      data: queueMessage
    })
    const result = await this.connectionSocketService.sendCommandToServerHook(
      queueMessage.data.serverId,
      queueMessage.data.commandId,
    )
    this.logger.info('Sent to server', {
      ...meta,
      result
    })
  }
}
