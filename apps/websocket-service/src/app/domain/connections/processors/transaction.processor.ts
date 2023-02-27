import { Processor, Process, OnQueueCompleted, OnQueueFailed } from '@nestjs/bull';
import { Job } from 'bull';
import { ConnectionSocketService } from '../service/connection-socket.service';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { createWinstonContext } from 'utils';

@Processor('TRANSACTION')
export class TransactionProcessor {

  constructor(
    private readonly connectionSocketService: ConnectionSocketService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
  }
  @Process()
  async sendToServer(job: Job) {
    const meta = createWinstonContext(
      this.constructor.name,
      this.sendToServer.name
    );

    this.logger.info('Getting information from bull queue', {
      ...meta,
      data: job.data
    })
    const data = await this.connectionSocketService.sendCommandToServerHook(
      job.data.serverToken,
      job.data.id,
    )
    this.logger.info('Sended to server', {
      ...meta,
      data
    })
    return data;
  }

  @OnQueueCompleted()
  onQueueCompleted(job: Job): void {
    const meta = createWinstonContext(
      this.constructor.name,
      this.onQueueFailed.name
    );

    this.logger.info(
      'Sending to server webhook finish', {
        ...meta,
        data: job.data,
      });
  }

  @OnQueueFailed()
  onQueueFailed(job: Job, err: Error): void {
    const meta = createWinstonContext(
      this.constructor.name,
      this.onQueueFailed.name
    );

    this.logger.error('Sending to server webhook fail', {
      ...meta,
      err,
    });
  }
}
