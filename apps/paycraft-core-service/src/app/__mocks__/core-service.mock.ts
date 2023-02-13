export const coreServiceEnvMock = {
  DATABASE_URL: 'DATABASE_URL',
};

export const configServiceMock = {
  get(key: string): string {
    return coreServiceEnvMock[key];
  },
};
