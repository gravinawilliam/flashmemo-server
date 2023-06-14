import { StatusError } from './status-error';

type ParametersConstructorDTO = {
  error?: Error;
  provider: {
    name: ProvidersNames;
    method: CryptoProviderMethods | PasswordProviderMethods | TokenProviderMethods;
    externalName?: string;
  };
};

export enum ProvidersNames {
  CRYPTO = 'crypto',
  PASSWORD = 'password',
  TOKEN = 'token'
}

export enum PasswordProviderMethods {
  ENCRYPT = 'encrypt',
  COMPARE = 'compare'
}

export enum TokenProviderMethods {
  GENERATE_JWT = 'generate jwt',
  VERIFY_JWT = 'verify jwt'
}
export enum CryptoProviderMethods {
  GENERATE_ID = 'generate id'
}

export class ProviderError {
  readonly status: StatusError;

  readonly message: string;

  readonly name: 'ProviderError';

  readonly error?: Error;

  constructor(parameters: ParametersConstructorDTO) {
    this.name = 'ProviderError';
    this.message = `Error in ${parameters.provider.name} provider in ${parameters.provider.method} method.${
      parameters.provider.externalName === undefined
        ? ''
        : ` Error in external lib name: ${parameters.provider.externalName}.`
    }`;
    this.status = StatusError.PROVIDER_ERROR;
    this.error = parameters.error;
  }
}
