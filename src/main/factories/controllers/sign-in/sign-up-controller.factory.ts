import { Controller } from '@application/controllers/_shared/controller';
import { SignInController, SignInControllerDTO } from '@application/controllers/sign-in/sign-in.controller';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeSignInUseCase } from '@factories/use-cases/sign-in/sing-in-use-case.factory';

export const makeSignInController = (): Controller<SignInControllerDTO.Parameters, SignInControllerDTO.Result> =>
  new SignInController(makeLoggerProvider(), makeSignInUseCase());
