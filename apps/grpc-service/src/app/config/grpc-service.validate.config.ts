import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';

import { ArgumentInvalidException } from 'common';
import { validationErrorsToString } from 'utils';
import { GrpcServiceEnv } from './grpc-service.env';

export function GrpcServiceValidateConfig(
  config: Record<string, unknown>,
): GrpcServiceEnv {
  const validatedConfig = plainToClass(GrpcServiceEnv, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new ArgumentInvalidException(validationErrorsToString(errors));
  }

  return validatedConfig;
}
