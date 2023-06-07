import { sign } from 'jsonwebtoken';

import { ISendLogErrorLoggerProvider } from '@contracts/providers/logger/send-log-error-logger.provider';
import {
  GenerateJwtTokenProviderDTO,
  IGenerateJwtTokenProvider
} from '@contracts/providers/token/generate-jwt.token-provider';

import { ProviderError, ProvidersNames, TokenProviderMethods } from '@errors/_shared/provider.error';

import { failure, success } from '@shared/utils/either.util';

export class JsonwebtokenTokenProvider implements IGenerateJwtTokenProvider {
  constructor(
    private readonly loggerProvider: ISendLogErrorLoggerProvider,
    private readonly environments: {
      SECRET: string;
      EXPIRES_IN: string;
      ALGORITHM: 'HS256' | 'HS384' | 'HS512';
      ISSUER: string;
    }
  ) {}

  public generateJwt(parameters: GenerateJwtTokenProviderDTO.Parameters): GenerateJwtTokenProviderDTO.Result {
    try {
      return success({
        jwtToken: sign({}, this.environments.SECRET, {
          subject: parameters.user.id.value,
          issuer: this.environments.ISSUER,
          expiresIn: this.environments.EXPIRES_IN,
          algorithm: this.environments.ALGORITHM
        })
      });
    } catch (error: any) {
      const errorProvider = new ProviderError({
        error,
        provider: { name: ProvidersNames.TOKEN, method: TokenProviderMethods.GENERATE_JWT, externalName: 'jsonwebtoken' }
      });

      this.loggerProvider.sendLogError({ message: errorProvider.message, value: error });

      return failure(errorProvider);
    }
  }
}
