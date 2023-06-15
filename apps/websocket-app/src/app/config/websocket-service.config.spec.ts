import { WebsocketServiceConfig } from './websocket-service.config';
import { ConfigService } from '@nestjs/config';
import {
  configServiceMock,
  coreServiceEnvMock,
} from '../__mocks__/core-service.mock';
import { Test, TestingModule } from '@nestjs/testing';

describe('CustomerServiceConfig', () => {
  let config: WebsocketServiceConfig;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        WebsocketServiceConfig,
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
      ],
    }).compile();
    config = moduleRef.get(WebsocketServiceConfig);
  });

  test('should return success database url', async () => {
    expect(config.databaseURL).toBe(coreServiceEnvMock.DATABASE_URL);
  });
});
