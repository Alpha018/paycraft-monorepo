import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UserService } from '../service/user.service';
import { GetUserByEmailDto, GetUserByIdDto, UserDatabaseDto } from '../dto/user-database.dto';

@Controller()
export class UserController {

  constructor(
    private readonly userService: UserService
  ) {
  }
  @GrpcMethod('userController', 'createUser')
  createUser(
    data: UserDatabaseDto
  ) {
    return this.userService.createUser(data);
  }

  @GrpcMethod('userController', 'getUserInformationById')
  getUserInformationById(
    data: GetUserByIdDto
  ) {
    return this.userService.getUserInfoById(data);
  }

  @GrpcMethod('userController', 'getUserInformationByEmail')
  getUserInformationByEmail(
    data: GetUserByEmailDto
  ) {
    return this.userService.getUserInfoByEmail(data);
  }
}
