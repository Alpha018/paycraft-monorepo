import * as winston from 'winston';

import { utilities as nestWinstonModuleUtilities } from 'nest-winston/dist/winston.utilities';

export const loggerOptions = (appName: string) => ({
  transports: [
    new winston.transports.Console({
      level: process.env.LOGGER_LEVEL,
      format: winston.format.combine(
        winston.format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike(appName, {
          prettyPrint: true,
          colors: true
        }),
      ),
    }),
  ],
});

export function createWinstonContext(
  constructorName: string,
  functionName: string,
) {
  return {
    labels: {
      app: process.env.APPLICATION_NAME,
      module: constructorName,
      function: functionName,
    },
  };
}
