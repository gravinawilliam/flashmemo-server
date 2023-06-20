import { Controller, ResponseSuccess, StatusSuccess } from '@application/controllers/_shared/controller';

import { ISendLogErrorLoggerProvider } from '@contracts/providers/logger/send-log-error-logger.provider';
import { ISendLogTimeControllerLoggerProvider } from '@contracts/providers/logger/send-log-time-controller.logger-provider';

import { UseCase } from '@use-cases/_shared/use-case';
import { GetDeckUseCaseDTO } from '@use-cases/decks/get-deck.use-case';
import { ListDecksUnansweredUseCaseDTO } from '@use-cases/decks/list-decks-unanswered.use-case';
import { VerifyAccessTokenUseCaseDTO } from '@use-cases/users/verify-access-token.use-case';

import { HttpRequest } from '@shared/types/http-request.type';
import { Either, failure, success } from '@shared/utils/either.util';

export class ListDecksUnansweredController extends Controller<
  ListDecksUnansweredControllerDTO.Parameters,
  ListDecksUnansweredControllerDTO.Result
> {
  constructor(
    loggerProvider: ISendLogErrorLoggerProvider & ISendLogTimeControllerLoggerProvider,
    private readonly verifyAccessTokenUseCase: UseCase<
      VerifyAccessTokenUseCaseDTO.Parameters,
      VerifyAccessTokenUseCaseDTO.ResultFailure,
      VerifyAccessTokenUseCaseDTO.ResultSuccess
    >,
    private readonly listDecksUnansweredUseCase: UseCase<
      ListDecksUnansweredUseCaseDTO.Parameters,
      ListDecksUnansweredUseCaseDTO.ResultFailure,
      ListDecksUnansweredUseCaseDTO.ResultSuccess
    >
  ) {
    super(loggerProvider);
  }

  protected async performOperation(
    parameters: ListDecksUnansweredControllerDTO.Parameters
  ): ListDecksUnansweredControllerDTO.Result {
    const resultVerifyAccessToken = await this.verifyAccessTokenUseCase.execute({
      accessToken: parameters.access_token
    });
    if (resultVerifyAccessToken.isFailure()) return failure(resultVerifyAccessToken.value);
    const { user } = resultVerifyAccessToken.value;

    const result = await this.listDecksUnansweredUseCase.execute({
      user
    });
    if (result.isFailure()) return failure(result.value);

    return success({
      status: StatusSuccess.DONE,
      data: {
        decksUnanswered: result.value.decksUnanswered
      }
    });
  }
}

export namespace ListDecksUnansweredControllerDTO {
  export type Parameters = Readonly<HttpRequest<undefined, undefined>>;

  type ResultError = Readonly<VerifyAccessTokenUseCaseDTO.ResultFailure | GetDeckUseCaseDTO.ResultFailure>;
  type ResultSuccess = Readonly<
    ResponseSuccess<{
      decksUnanswered: {
        id: string;
        collection: {
          id: string;
          name: string;
        };
      }[];
    }>
  >;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}
