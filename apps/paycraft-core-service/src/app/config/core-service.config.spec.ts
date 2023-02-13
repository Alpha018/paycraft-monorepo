import { CoreServiceConfig } from './core-service.config';
import { ConfigService } from '@nestjs/config';
import {
  configServiceMock,
  coreServiceEnvMock,
} from '../__mocks__/core-service.mock';
import { Test, TestingModule } from '@nestjs/testing';

describe('CustomerServiceConfig', () => {
  let config: CoreServiceConfig;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        CoreServiceConfig,
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
      ],
    }).compile();
    config = moduleRef.get(CoreServiceConfig);
  });

  test('should return success database url', async () => {
    expect(config.databaseURL).toBe(coreServiceEnvMock.DATABASE_URL);
  });
});
