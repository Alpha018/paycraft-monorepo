import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';

import { ArgumentInvalidException } from 'common';
import { validationErrorsToString } from 'utils';
import { RestServiceEnv } from './rest-service.env';

export function RestServiceValidateConfig(
  config: Record<string, unknown>,
): RestServiceEnv {
  const validatedConfig = plainToClass(RestServiceEnv, config, {
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
