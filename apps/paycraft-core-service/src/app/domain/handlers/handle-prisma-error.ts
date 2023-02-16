import { Prisma } from '@prisma/client';
import {
  BadRequestException, Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { createWinstonContext, extractionUniqueConstrainErrorPrismaMessage } from 'utils';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class PrismaErrorHandler {

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
  }
  handlePrismaErrors(error, functionName = '') {
    const context = createWinstonContext(
      this.constructor.name,
      functionName
        ? functionName
        : this.handlePrismaErrors.name,
    );

    switch (error) {
      case Prisma.PrismaClientKnownRequestError: {
        this.knowsPrismaCode(error, context);
        break;
      }
      case Prisma.PrismaClientUnknownRequestError: {
        this.logger.error(
          'Unknown error of Prisma. Request to the database failed',
          {
            message: error.message,
            ...context,
          },
        );
        throw new InternalServerErrorException(
          'Error to connecting to other services, unknown error',
        );
      }
      default: {
        this.knowsPrismaCode(error, context);
        this.logger.error('An error has occurred...', {
          message: error.message,
          ...context,
        });
        throw new InternalServerErrorException(
          'Error has occurred with the other service',
        );
      }
    }
  }

  knowsPrismaCode(error, context) {
    switch (error.code) {
      case 'P2002': {
        this.logger.error('Error to save data in DB', {
          message: `${error.message}, code: ${error.code}`,
          ...context,
        });
        throw new BadRequestException(
          extractionUniqueConstrainErrorPrismaMessage(error.message),
        );
      }
      case 'P2003': {
        this.logger.error('Error to save data in DB', {
          message: `${error.message}, code: ${error.code}`,
          ...context,
        });
        throw new BadRequestException(error.message);
      }
      default: {
        this.logger.error('Known error of Prisma. Request to the database failed', {
          message: `${error.message}, code: ${error.code}`,
          ...context,
        });
        throw new InternalServerErrorException(
          'Error to connecting to other services, known error',
        );
      }
    }
  }
}
