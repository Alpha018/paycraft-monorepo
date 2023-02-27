export const restServiceEnvMock = {
  NODE_ENV: 'test'
};

export const configServiceMock = {
  get(key: string): string {
    return restServiceEnvMock[key];
  },
};
