import {
  getEnvironmentNumber,
  getEnvironmentString
} from '@infrastructure/providers/get-envs/dot-environment.get-environments-provider';

enum NODE_ENV {
  DEVELOPMENT = 'DEVELOPMENT',
  PRODUCTION = 'PRODUCTION',
  LOCAL = 'LOCAL'
}

export const TOKEN_JWT_CONFIG = {
  ALGORITHM: getEnvironmentString({
    defaultValue: 'HS256',
    key: 'TOKEN_JWT_ALGORITHM'
  }) as 'HS256' | 'HS384' | 'HS512',
  EXPIRES_IN: getEnvironmentString({
    defaultValue: '1d',
    key: 'TOKEN_JWT_EXPIRES_IN'
  }),
  ISSUER: getEnvironmentString({
    defaultValue: 'issuer',
    key: 'TOKEN_JWT_ISSUER'
  }),
  SECRET: getEnvironmentString({
    defaultValue: 'secret',
    key: 'TOKEN_JWT_SECRET'
  })
};

export const GLOBAL_CONFIG = {
  ENVIRONMENT: getEnvironmentString({
    defaultValue: NODE_ENV.DEVELOPMENT,
    key: 'NODE_ENV'
  }),
  IS_DEVELOPMENT:
    getEnvironmentString({
      defaultValue: NODE_ENV.DEVELOPMENT,
      key: 'NODE_ENV'
    }) === NODE_ENV.DEVELOPMENT,
  IS_PRODUCTION:
    getEnvironmentString({
      defaultValue: NODE_ENV.DEVELOPMENT,
      key: 'NODE_ENV'
    }) === NODE_ENV.PRODUCTION,
  LOGS_FOLDER: getEnvironmentString({
    defaultValue: 'logs',
    key: 'LOGS_FOLDER'
  }),
  APP_NAME: getEnvironmentString({
    defaultValue: 'User Account',
    key: 'APP_NAME'
  }),
  APP_PORT: getEnvironmentNumber({
    defaultValue: 2222,
    key: 'APP_PORT'
  }),
  DOCS_PATH: getEnvironmentString({
    defaultValue: '/docs',
    key: 'DOCS_PATH'
  })
};
