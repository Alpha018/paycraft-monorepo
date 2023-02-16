import { Controller } from '@nestjs/common';
import { ServerService } from '../service/server.service';
import { CreateServerDto, ServerQuery, ServerUserQuery } from '../dto/server.dto';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class ServerController {
  constructor(
    private readonly serverService: ServerService
  ) {}

  @GrpcMethod('serverController', 'createServer')
  createServer(body: CreateServerDto) {
    return this.serverService.createServer(body);
  }

  @GrpcMethod('serverController', 'getServersByUser')
  getUserServers(data: ServerUserQuery) {
    return this.serverService.getUserServers(data);
  }

  @GrpcMethod('serverController', 'getServer')
  getServer(data: ServerQuery) {
    return this.serverService.getServer(data);
  }
}
