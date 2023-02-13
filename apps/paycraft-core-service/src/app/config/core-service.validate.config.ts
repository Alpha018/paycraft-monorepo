import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';

import { ArgumentInvalidException } from 'common';
import { validationErrorsToString } from 'utils';
import { CoreServiceEnv } from './core-service.env';

export function CoreServiceValidateConfig(
  config: Record<string, unknown>,
): CoreServiceEnv {
  const validatedConfig = plainToClass(CoreServiceEnv, config, {
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
