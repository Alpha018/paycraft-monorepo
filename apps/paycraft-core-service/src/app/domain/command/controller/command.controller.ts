import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CommandService } from '../service/command.service';
import { changeCommandDto, expireDateDto, pendingTransactionDto } from '../dto/command.dto';
import { CommandRepository } from '../repository/command.repository';

@Controller()
export class CommandController {
  constructor(
    private readonly commandService: CommandService,
    private readonly commandRepository: CommandRepository
  ) {}

  @GrpcMethod('CommandController', 'getPendingToSendTransaction')
  getPendingToSendTransaction(body: pendingTransactionDto) {
    return this.commandService.getPendingToSendTransaction(body);
  }

  @GrpcMethod('CommandController', 'getExpiredToSendTransaction')
  getExpiredToSendTransaction(body: pendingTransactionDto) {
    return this.commandService.getExpiredToSendTransaction(body);
  }

  @GrpcMethod('CommandController', 'changeCommandToSend')
  changeCommandToSend(body: changeCommandDto) {
    return this.commandService.changeCommandToSend(body.id);
  }

  @GrpcMethod('CommandController', 'changeCommandToSendExpired')
  changeCommandToSendExpired(body: changeCommandDto) {
    return this.commandService.changeCommandToSendExpired(body.id);
  }

  @GrpcMethod('CommandController', 'getCommandById')
  async getCommandById(body: changeCommandDto) {
    return this.commandRepository.getCommandById(body.id, body.status);
  }

  @GrpcMethod('CommandController', 'changeCommandStatus')
  changeCommandStatus(body: changeCommandDto) {
    return this.commandRepository.changeCommandStatus(body.id, body.status);
  }

  @GrpcMethod('CommandController', 'changeExpireDate')
  changeExpireDate(body: expireDateDto) {
    return this.commandRepository.changeCommandDate(body.id, body.expireDate);
  }
}
