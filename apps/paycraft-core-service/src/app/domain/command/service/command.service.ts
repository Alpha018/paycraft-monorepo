import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { CommandRepository } from '../repository/command.repository';
import { createWinstonContext } from 'utils';
import { CommandStatus } from '@prisma/client';

@Injectable()
export class CommandService {
  constructor(
    private readonly commandRepository: CommandRepository,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  async getPendingToSendTransaction(params: {
    id?: number;
    serverToken?: string;
  }) {
    const meta = createWinstonContext(
      this.constructor.name,
      this.getPendingToSendTransaction.name
    );

    try {
      this.logger.info('Getting pending command!!', { ...meta });
      const pending = await this.commandRepository.getPendingCommandOfServer(params);
      return {
        items: pending
      }
    } catch (e) {
      this.logger.error('Error in getting server command', {
        ...meta,
        error: e.message,
      });
      throw new HttpException('Error in get server data', 500);
    }
  }

  async getExpiredToSendTransaction(params: {
    id?: number;
    serverToken?: string;
  }) {
    const meta = createWinstonContext(
      this.constructor.name,
      this.getExpiredToSendTransaction.name
    );

    try {
      this.logger.info('Getting expired command!!', { ...meta });
      const pending = await this.commandRepository.getExpiredCommandOfServer(params);
      return {
        items: pending
      }
    } catch (e) {
      this.logger.error('Error in getting server command', {
        ...meta,
        error: e.message,
      });
      throw new HttpException('Error in get server data', 500);
    }
  }

  async changeCommandToSend(commandId: number) {
    const meta = createWinstonContext(
      this.constructor.name,
      this.changeCommandToSend.name
    );

    try {
      this.logger.info('Change command to send', { ...meta, commandId });
      return this.commandRepository.changeCommandStatus(
        commandId,
        CommandStatus.SEND
      );
    } catch (e) {
      this.logger.error('Error in change command to send', {
        ...meta,
        error: e.message,
      });
      throw new HttpException('Error in change command to send', 500);
    }
  }

  async changeCommandToSendExpired(commandId: number) {
    const meta = createWinstonContext(
      this.constructor.name,
      this.changeCommandToSendExpired.name
    );

    try {
      this.logger.info('Change command to send expired', {
        ...meta,
        commandId,
      });
      return this.commandRepository.changeCommandStatus(
        commandId,
        CommandStatus.SEND_EXPIRED
      );
    } catch (e) {
      this.logger.error('Error in change command to send expired', {
        ...meta,
        error: e.message,
      });
      throw new HttpException('Error in change command to send expired', 500);
    }
  }

  async changeCommandStatus(commandId: number, status: CommandStatus) {
    const meta = createWinstonContext(
      this.constructor.name,
      this.changeCommandStatus.name
    );

    try {
      this.logger.info('Change command to another status', {
        ...meta,
        commandId,
        status,
      });
      return this.commandRepository.changeCommandStatus(commandId, status);
    } catch (e) {
      this.logger.error('Error in change command to done', {
        ...meta,
        error: e.message,
      });
      throw new HttpException('Error in change command to done', 500);
    }
  }

  getCommandByDates(
    serverId: number,
    startDate: Date,
    endDate: Date,
    status?: CommandStatus
  ) {
    return this.commandRepository.getCommandDate(
      serverId,
      startDate,
      endDate,
      status
    );
  }
}
