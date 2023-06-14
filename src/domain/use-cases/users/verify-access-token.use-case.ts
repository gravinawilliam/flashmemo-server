import { ISendLogTimeUseCaseLoggerProvider } from '@contracts/providers/logger/send-log-time-use-case.logger-provider';
import { IVerifyJwtTokenProvider } from '@contracts/providers/token/verify-jwt.token-provider';
import { IFindByIdUsersRepository } from '@contracts/repositories/users/find-by-id.users-repository';

import { ProviderError } from '@errors/_shared/provider.error';
import { RepositoryError } from '@errors/_shared/repository.error';
import { InvalidAccessTokenError } from '@errors/models/users/invalid-access-token.error';
import { InvalidEmailError } from '@errors/value-objects/email/invalid-email.error';

import { User } from '@models/user.model';

import { UseCase } from '@domain/use-cases/_shared/use-case';

import { Either, failure, success } from '@shared/utils/either.util';

export class VerifyAccessTokenUseCase extends UseCase<
  VerifyAccessTokenUseCaseDTO.Parameters,
  VerifyAccessTokenUseCaseDTO.ResultFailure,
  VerifyAccessTokenUseCaseDTO.ResultSuccess
> {
  constructor(
    loggerProvider: ISendLogTimeUseCaseLoggerProvider,
    private readonly usersRepository: IFindByIdUsersRepository,
    private readonly tokenProvider: IVerifyJwtTokenProvider
  ) {
    super(loggerProvider);
  }

  protected async performOperation(
    parameters: VerifyAccessTokenUseCaseDTO.Parameters
  ): VerifyAccessTokenUseCaseDTO.Result {
    const resultVerifyJwtToken = this.tokenProvider.verifyJwt({ token: parameters.accessToken });
    if (resultVerifyJwtToken.isFailure()) return failure(resultVerifyJwtToken.value);
    const { user } = resultVerifyJwtToken.value;

    const resultFindById = await this.usersRepository.findById({
      id: user.id
    });
    if (resultFindById.isFailure()) return failure(resultFindById.value);
    const { user: foundUser } = resultFindById.value;
    if (foundUser === undefined) return failure(new InvalidAccessTokenError());

    return success({ user: { id: foundUser.id } });
  }
}

export namespace VerifyAccessTokenUseCaseDTO {
  export type Parameters = Readonly<{
    accessToken: string;
  }>;

  export type ResultFailure = Readonly<ProviderError | RepositoryError | InvalidEmailError | InvalidAccessTokenError>;
  export type ResultSuccess = Readonly<{ user: Pick<User, 'id'> }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}
