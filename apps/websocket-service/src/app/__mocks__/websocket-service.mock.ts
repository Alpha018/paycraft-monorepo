export const websocketServiceEnvMock = {
  NODE_ENV: 'test'
};

export const configServiceMock = {
  get(key: string): string {
    return websocketServiceEnvMock[key];
  },
};
