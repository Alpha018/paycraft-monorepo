import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Logger } from 'winston';
import { FirebaseService } from '../service/firebase.service';
import { User } from '../domain/user';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { createWinstonContext } from 'utils';
import { ConnectionsName } from 'common';
import { ClientGrpc } from '@nestjs/microservices';
import { userController } from '../../domain/proto-gen/service';
import { lastValueFrom } from 'rxjs';
import { getUserResponse, userRole } from '../../domain/proto-gen/response/user';

export enum TypeAuthorization {
  bearer = 'Bearer',
  static = 'Static',
  server = 'Server',
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user: getUserResponse;
    }
  }
}

@Injectable()
export class AdminUserMiddleware implements NestMiddleware {
  private userController: userController;
  constructor(
    private readonly firebaseService: FirebaseService,
    @Inject(ConnectionsName.ConnectionName) private client: ClientGrpc,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
    this.userController = this.client.getService<userController>('userController');
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const meta = createWinstonContext(this.constructor.name, this.use.name);
    const authorization = req.header('authorization');

    if (!authorization) {
      this.logger.warn('unauthorized', meta);
      throw new UnauthorizedException('Unauthorized');
    }

    const [type, code] = authorization.split(' ');
    // eslint-disable-next-line sonarjs/no-small-switch
    switch (type) {
      case TypeAuthorization.bearer: {
        try {
          this.logger.info('verifying bearer token', meta);
          const firebaseUser = (await this.firebaseService.auth.verifyIdToken(
            code,
            true
          )) as User;
          const dbUser = await lastValueFrom(this.userController.getUserInformationByEmail({
            email: firebaseUser.email
          }));

          if (!dbUser) {
            this.logger.error('User not exist in postgres', {
              ...meta,
              user: firebaseUser.uid,
            });
            return next(new UnauthorizedException('Unauthorized'));
          }

          req.user = dbUser;

          if (!req.user.database.roles) {
            req.user.database.roles = [userRole.USER];
          }
          break;
        } catch (err) {
          this.logger.error('Error in middleware', {
            ...meta,
            error: err.message,
          });
          next(new UnauthorizedException('Unauthorized'));
          break;
        }
      }
      default: {
        return next(
          new HttpException('Not found Token', HttpStatus.BAD_REQUEST)
        );
      }
    }
    return next();
  }
}
