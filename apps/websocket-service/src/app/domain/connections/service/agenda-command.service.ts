import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { createWinstonContext } from 'utils';
import { ConnectionSocketService } from './connection-socket.service';
import { WebsocketServiceConfig } from '../../../config/websocket-service.config';
import { Agenda, Job } from '@hokify/agenda';

@Injectable()
export class AgendaCommandService {
  JobName = 'EXPIRED_JOB';
  mongoConnectionString: string;

  agenda;

  constructor(
    @Inject(forwardRef(() => ConnectionSocketService))
    private readonly connectionService: ConnectionSocketService,
    private readonly configService: WebsocketServiceConfig,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
    this.mongoConnectionString = this.configService.mongoConfig.url;
    this.agenda = new Agenda({ db: { address: this.mongoConnectionString } })

    this.agenda.define(
      this.JobName,
      { lockLifetime: 10000 },
      this.expiredJob.bind(this)
    );
  }

  async createExpiredJob(date: Date, commandId: string): Promise<void> {
    const meta = createWinstonContext(
      this.constructor.name,
      this.createExpiredJob.name
    );

    this.logger.info('Creating a schedule expire command', {
      ...meta,
      commandId,
    });
    await this.agenda.schedule(date, this.JobName, { commandId });
  }

  private async expiredJob(
    job: Job,
    done: (err?: Error) => void
  ): Promise<void> {
    const meta = createWinstonContext(
      this.constructor.name,
      this.createExpiredJob.name
    );

    const commandId = job.attrs.data['commandId'];
    this.logger.info('Executing expire command to send server', {
      ...meta,
      commandId,
    });

    await this.connectionService.sendExpiredCommandHook(commandId);
    await job.remove();
    done();
  }
}
