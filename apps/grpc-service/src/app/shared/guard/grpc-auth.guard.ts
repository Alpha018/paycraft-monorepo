import { Injectable, CanActivate, ExecutionContext, Inject, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from '../service/firebase.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { createWinstonContext } from 'utils';
import { User } from '../domain/user';

export enum TypeAuthorization {
  bearer = 'Bearer',
}

export enum ConnectionType {
  GRPC = 'rpc'
}
@Injectable()
export class GrpcAuthGuard implements CanActivate {
  constructor(
    private readonly firebaseService: FirebaseService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const meta = createWinstonContext(this.constructor.name, this.canActivate.name);
    const type = context.getType();

    if(type !== ConnectionType.GRPC) {
      return false;
    }

    const metadata = context.getArgByIndex(1);
    if (!metadata) {
      return false;
    }

    const authorization = metadata.get('Authorization')[0];

    if (!authorization) {
      this.logger.warn('unauthorized', meta);
      throw new UnauthorizedException('Unauthorized');
    }

    const [tokenType, code] = authorization.split(' ');
    // eslint-disable-next-line sonarjs/no-small-switch
    switch (tokenType) {
      case TypeAuthorization.bearer: {
        let firebaseUser;
        try {
          this.logger.info('verifying bearer token', meta);
          firebaseUser = (await this.firebaseService.auth.verifyIdToken(
            code,
            true
          )) as User;
        } catch (err) {
          this.logger.error('Error in auth guard', {
            ...meta,
            error: err.message,
          });
          throw new UnauthorizedException('Unauthorized');
        }

        if (!firebaseUser) {
          this.logger.error('User not exist in firebase', {
            ...meta,
            user: firebaseUser.uid,
          });
          throw new UnauthorizedException('Unauthorized');
        }

        metadata.set('firebaseUid', firebaseUser.uid)
        return true;
      }
    }
    return false;
  }
}
