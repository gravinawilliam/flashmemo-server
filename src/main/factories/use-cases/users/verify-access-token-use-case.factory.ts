import { UseCase } from '@use-cases/_shared/use-case';
import { VerifyAccessTokenUseCase, VerifyAccessTokenUseCaseDTO } from '@use-cases/users/verify-access-token.use-case';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeTokenJwtProvider } from '@factories/providers/token-provider.factory';
import { makeUsersRepository } from '@factories/repositories/users-repository.factory';

export const makeVerifyAccessTokenUseCase = (): UseCase<
  VerifyAccessTokenUseCaseDTO.Parameters,
  VerifyAccessTokenUseCaseDTO.ResultFailure,
  VerifyAccessTokenUseCaseDTO.ResultSuccess
> => new VerifyAccessTokenUseCase(makeLoggerProvider(), makeUsersRepository(), makeTokenJwtProvider());
