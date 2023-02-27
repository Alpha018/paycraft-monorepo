import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';

import { ArgumentInvalidException } from 'common';
import { validationErrorsToString } from 'utils';
import { WebsocketServiceEnv } from './websocket-service.env';

export function WebsocketServiceValidateConfig(
  config: Record<string, unknown>,
): WebsocketServiceEnv {
  const validatedConfig = plainToClass(WebsocketServiceEnv, config, {
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
