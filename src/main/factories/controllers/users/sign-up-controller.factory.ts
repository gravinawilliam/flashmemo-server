import { Controller } from '@application/controllers/_shared/controller';
import { SignUpController, SignUpControllerDTO } from '@application/controllers/users/sign-up.controller';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeSignUpUseCase } from '@factories/use-cases/users/sign-up-use-case.factory';
import { makeSignInUseCase } from '@factories/use-cases/users/sing-in-use-case.factory';

export const makeSignUpController = (): Controller<SignUpControllerDTO.Parameters, SignUpControllerDTO.Result> =>
  new SignUpController(makeLoggerProvider(), makeSignUpUseCase(), makeSignInUseCase());
