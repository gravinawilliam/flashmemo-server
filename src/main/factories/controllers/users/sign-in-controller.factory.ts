import { Controller } from '@application/controllers/_shared/controller';
import { SignInController, SignInControllerDTO } from '@application/controllers/users/sign-in.controller';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeSignInUseCase } from '@factories/use-cases/users/sing-in-use-case.factory';

export const makeSignInController = (): Controller<SignInControllerDTO.Parameters, SignInControllerDTO.Result> =>
  new SignInController(makeLoggerProvider(), makeSignInUseCase());
