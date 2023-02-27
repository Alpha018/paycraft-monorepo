import { RestServiceConfig } from './rest-service.config';
import { ConfigService } from '@nestjs/config';
import {
  configServiceMock,
  restServiceEnvMock,
} from '../__mocks__/rest-service.mock';
import { Test, TestingModule } from '@nestjs/testing';

describe('CustomerServiceConfig', () => {
  let config: RestServiceConfig;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        RestServiceConfig,
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
      ],
    }).compile();
    config = moduleRef.get(RestServiceConfig);
  });

  test('should return success database url', async () => {
    expect(config.appConfig.nodeEnv).toBe(restServiceEnvMock.NODE_ENV);
  });
});
