import { UseCase } from '@use-cases/_shared/use-case';
import { SignInUseCase, SignInUseCaseDTO } from '@use-cases/users/sign-in.use-case';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeTokenJwtProvider } from '@factories/providers/token-provider.factory';

import { makeCredentialsSignInUseCase } from './credentials-sign-in-use-case.factory';

export const makeSignInUseCase = (): UseCase<
  SignInUseCaseDTO.Parameters,
  SignInUseCaseDTO.ResultFailure,
  SignInUseCaseDTO.ResultSuccess
> => new SignInUseCase(makeLoggerProvider(), makeTokenJwtProvider(), makeCredentialsSignInUseCase());
