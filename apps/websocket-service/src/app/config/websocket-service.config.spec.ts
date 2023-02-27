import { WebsocketServiceConfig } from './websocket-service.config';
import { ConfigService } from '@nestjs/config';
import {
  configServiceMock,
  websocketServiceEnvMock,
} from '../__mocks__/websocket-service.mock';
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
    expect(config.appConfig.nodeEnv).toBe(websocketServiceEnvMock.NODE_ENV);
  });
});
