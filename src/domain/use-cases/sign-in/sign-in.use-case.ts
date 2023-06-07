import { ISendLogTimeUseCaseLoggerProvider } from '@contracts/providers/logger/send-log-time-use-case.logger-provider';
import { IGenerateJwtTokenProvider } from '@contracts/providers/token/generate-jwt.token-provider';

import { ProviderError } from '@errors/_shared/provider.error';
import { RepositoryError } from '@errors/_shared/repository.error';
import { SignInError, SignInErrorMotive } from '@errors/use-cases/sign-in.error';
import { InvalidEmailError } from '@errors/value-objects/email/invalid-email.error';
import { InvalidPasswordError } from '@errors/value-objects/password/invalid-password.error';

import { User } from '@models/user.model';

import { UseCase } from '@use-cases/_shared/use-case';

import { Either, failure, success } from '@shared/utils/either.util';

import { CredentialsSignInUseCaseDTO } from './credentials-sign-in.use-case';

export class SignInUseCase extends UseCase<
  SignInUseCaseDTO.Parameters,
  SignInUseCaseDTO.ResultFailure,
  SignInUseCaseDTO.ResultSuccess
> {
  constructor(
    loggerProvider: ISendLogTimeUseCaseLoggerProvider,
    private readonly tokenProvider: IGenerateJwtTokenProvider,
    private readonly credentialsSignInUseCase: UseCase<
      CredentialsSignInUseCaseDTO.Parameters,
      CredentialsSignInUseCaseDTO.ResultFailure,
      CredentialsSignInUseCaseDTO.ResultSuccess
    >
  ) {
    super(loggerProvider);
  }

  protected async performOperation(parameters: SignInUseCaseDTO.Parameters): SignInUseCaseDTO.Result {
    if (parameters.credentials !== undefined) {
      const result = await this.credentialsSignInUseCase.execute({
        credentials: {
          password: parameters.credentials.password,
          email: parameters.credentials.email
        }
      });
      if (result.isFailure()) return failure(result.value);
      return this.generateToken(result.value);
    }

    if (parameters.user === undefined) return failure(new SignInError({ motive: SignInErrorMotive.USER_NOT_FOUND }));

    return this.generateToken({ user: parameters.user });
  }

  private generateToken(parameters: { user: Pick<User, 'id'> }): Either<ProviderError, { accessToken: string }> {
    const resultGenerateJwt = this.tokenProvider.generateJwt({ user: { id: parameters.user.id } });
    if (resultGenerateJwt.isFailure()) return failure(resultGenerateJwt.value);
    return success({ accessToken: resultGenerateJwt.value.jwtToken });
  }
}

export namespace SignInUseCaseDTO {
  export type Parameters = Readonly<{
    credentials?: {
      email: string;
      password: string;
    };
    user?: Pick<User, 'id'>;
  }>;

  export type ResultFailure = Readonly<
    RepositoryError | ProviderError | SignInError | InvalidEmailError | InvalidPasswordError
  >;
  export type ResultSuccess = Readonly<{ accessToken: string }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}
