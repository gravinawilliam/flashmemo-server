import { Controller, ResponseSuccess, StatusSuccess } from '@application/controllers/_shared/controller';

import { ISendLogErrorLoggerProvider } from '@contracts/providers/logger/send-log-error-logger.provider';
import { ISendLogTimeControllerLoggerProvider } from '@contracts/providers/logger/send-log-time-controller.logger-provider';

import { UseCase } from '@use-cases/_shared/use-case';
import { SignInUseCaseDTO } from '@use-cases/sign-in/sign-in.use-case';

import { HttpRequest } from '@shared/types/http-request.type';
import { Either, failure, success } from '@shared/utils/either.util';

export class SignInController extends Controller<SignInControllerDTO.Parameters, SignInControllerDTO.Result> {
  constructor(
    loggerProvider: ISendLogErrorLoggerProvider & ISendLogTimeControllerLoggerProvider,
    private readonly signInUseCase: UseCase<
      SignInUseCaseDTO.Parameters,
      SignInUseCaseDTO.ResultFailure,
      SignInUseCaseDTO.ResultSuccess
    >
  ) {
    super(loggerProvider);
  }

  protected async performOperation(parameters: SignInControllerDTO.Parameters): SignInControllerDTO.Result {
    const resultSignIn = await this.signInUseCase.execute({
      credentials: {
        email: parameters.body.email,
        password: parameters.body.password
      }
    });
    if (resultSignIn.isFailure()) return failure(resultSignIn.value);
    const {
      accessToken,
      user: { email, id, name }
    } = resultSignIn.value;

    return success({
      status: StatusSuccess.DONE,
      data: {
        access_token: accessToken,
        user: {
          name,
          id: id.value,
          email: email.value
        }
      }
    });
  }
}

export namespace SignInControllerDTO {
  export type Parameters = Readonly<
    HttpRequest<{
      email: string;
      password: string;
    }>
  >;

  type ResultError = SignInUseCaseDTO.ResultFailure;
  type ResultSuccess = Readonly<
    ResponseSuccess<{
      access_token: string;
      user: {
        id: string;
        name: string;
        email: string;
      };
    }>
  >;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}
