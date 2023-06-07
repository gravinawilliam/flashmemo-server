import { Controller, ResponseSuccess, StatusSuccess } from '@application/controllers/_shared/controller';

import { ISendLogErrorLoggerProvider } from '@contracts/providers/logger/send-log-error-logger.provider';
import { ISendLogTimeControllerLoggerProvider } from '@contracts/providers/logger/send-log-time-controller.logger-provider';

import { UseCase } from '@use-cases/_shared/use-case';
import { SignInUseCaseDTO } from '@use-cases/sign-in/sign-in.use-case';
import { SignUpUseCaseDTO } from '@use-cases/sign-up/sign-up.use-case';

import { HttpRequest } from '@shared/types/http-request.type';
import { Either, failure, success } from '@shared/utils/either.util';

export class SignUpController extends Controller<SignUpControllerDTO.Parameters, SignUpControllerDTO.Result> {
  constructor(
    loggerProvider: ISendLogErrorLoggerProvider & ISendLogTimeControllerLoggerProvider,
    private readonly signUpUseCase: UseCase<
      SignUpUseCaseDTO.Parameters,
      SignUpUseCaseDTO.ResultFailure,
      SignUpUseCaseDTO.ResultSuccess
    >,
    private readonly signInUseCase: UseCase<
      SignInUseCaseDTO.Parameters,
      SignInUseCaseDTO.ResultFailure,
      SignInUseCaseDTO.ResultSuccess
    >
  ) {
    super(loggerProvider);
  }

  protected async performOperation(parameters: SignUpControllerDTO.Parameters): SignUpControllerDTO.Result {
    const resultSignUp = await this.signUpUseCase.execute({
      email: parameters.body.email,
      password: parameters.body.password,
      name: parameters.body.name
    });
    if (resultSignUp.isFailure()) return failure(resultSignUp.value);
    const { user } = resultSignUp.value;

    const resultSignIn = await this.signInUseCase.execute({ user });
    if (resultSignIn.isFailure()) return failure(resultSignIn.value);
    const {
      accessToken,
      user: { email, id, name }
    } = resultSignIn.value;

    return success({
      status: StatusSuccess.CREATED,
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

export namespace SignUpControllerDTO {
  export type Parameters = Readonly<
    HttpRequest<{
      email: string;
      password: string;
      name: string;
    }>
  >;

  type ResultError = SignUpUseCaseDTO.ResultFailure | SignInUseCaseDTO.ResultFailure;
  type ResultSuccess = Readonly<
    ResponseSuccess<{
      access_token: string;
      user: {
        name: string;
        email: string;
        id: string;
      };
    }>
  >;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}
