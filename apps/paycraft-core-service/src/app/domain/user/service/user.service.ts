import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { FirebaseService } from '../../../shared/service/firebase.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { GetUserByEmailDto, GetUserByIdDto, UserDatabaseDto } from '../dto/user-database.dto';
import { createWinstonContext, randomString } from 'utils';
import { PrismaErrorHandler } from '../../handlers/handle-prisma-error';
import { HandleFirebaseError } from '../../handlers/handle-firebase-error';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly firebaseService: FirebaseService,
    private readonly prismaErrorHandler: PrismaErrorHandler,
    private readonly handleFirebaseError: HandleFirebaseError,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
  }

  async createUser(user: UserDatabaseDto) {
    const meta = createWinstonContext(
      this.constructor.name,
      this.createUser.name
    );

    const randomPassword = randomString(12);
    this.logger.info('Starting process to create user', {
      ...meta,
      user: user.email,
    });

    let firebaseUser;
    try {
      firebaseUser = await this.firebaseService.auth.createUser({
        displayName: user.displayName,
        email: user.email,
        password: randomPassword,
      });
      await this.firebaseService.auth.setCustomUserClaims(
        firebaseUser.uid,
        {
          roles: [user.role]
        }
      )
    } catch (e) {
      this.handleFirebaseError.handleFirebaseErrors(e, this.createUser.name)
    }


    this.logger.info('User Created with password', {
      ...meta,
      password: randomPassword,
    });

    let mongoPg;
    try {
      mongoPg = await this.userRepository.createUser({
        firebaseUid: firebaseUser.uid,
        roles: [user.role]
      });
    } catch (e) {
      this.prismaErrorHandler.handlePrismaErrors(e, this.createUser.name)
    }


    //TODO: implement email service to send information of user
    this.logger.info('User created', { ...meta, user: mongoPg.id });
    return {
      ...mongoPg,
      password: randomPassword
    };
  }

  async getUserInfoById(data: GetUserByIdDto) {
    const meta = createWinstonContext(
      this.constructor.name,
      this.getUserInfoById.name
    );

    this.logger.info('Getting user information by ID', {
      ...meta,
      data
    });

    let database;
    let firebase;

    try {
      database = await this.userRepository.getUserById(data.id);
    } catch (e) {
      this.prismaErrorHandler.handlePrismaErrors(e, this.createUser.name)
    }

    if (!database) {
      throw new NotFoundException('User not found in database');
    }

    try {
      firebase = await this.firebaseService.auth.getUser(database.firebaseUid);
    } catch (e) {
      this.handleFirebaseError.handleFirebaseErrors(e, this.getUserInfoById.name)
    }

    if (!firebase) {
      throw new NotFoundException('User not found in firebase');
    }

    return {
      database,
      firebase
    }
  }

  async getUserInfoByEmail(data: GetUserByEmailDto) {
    const meta = createWinstonContext(
      this.constructor.name,
      this.getUserInfoByEmail.name
    );

    this.logger.info('Getting user information by email', {
      ...meta,
      data
    });

    let database;
    let firebase;

    try {
      firebase = await this.firebaseService.auth.getUserByEmail(data.email);
    } catch (e) {
      this.handleFirebaseError.handleFirebaseErrors(e, this.getUserInfoById.name)
    }

    if (!firebase) {
      throw new NotFoundException('User not found in firebase');
    }

    try {
      database = await this.userRepository.getUserByFirebaseUid(firebase.uid);
    } catch (e) {
      this.prismaErrorHandler.handlePrismaErrors(e, this.createUser.name)
    }

    if (!database) {
      throw new NotFoundException('User not found in database');
    }

    return {
      database,
      firebase
    }
  }
}
