import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { createWinstonContext } from 'utils';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class HandleFirebaseError {

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
  }

  handleFirebaseErrors(error, functionName = '') {
    const context = createWinstonContext(
      this.constructor.name,
      functionName
        ? functionName
        : this.handleFirebaseErrors.name,
    );

    this.logger.error('Error in firebase connection', {
      ...context,
      message: error.message,
      error: error,
    });
    throw new InternalServerErrorException(
      'Error has occurred with the other service',
    );
  }
}
