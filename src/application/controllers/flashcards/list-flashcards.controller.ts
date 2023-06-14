import { Controller, ResponseSuccess, StatusSuccess } from '@application/controllers/_shared/controller';

import { ISendLogErrorLoggerProvider } from '@contracts/providers/logger/send-log-error-logger.provider';
import { ISendLogTimeControllerLoggerProvider } from '@contracts/providers/logger/send-log-time-controller.logger-provider';

import { Flashcard, FlashcardResponse } from '@models/flashcard.model';

import { UseCase } from '@use-cases/_shared/use-case';
import { ListFlashcardsUseCaseDTO } from '@use-cases/flashcards/list-flashcards.use-case';
import { VerifyAccessTokenUseCaseDTO } from '@use-cases/users/verify-access-token.use-case';

import { HttpRequest } from '@shared/types/http-request.type';
import { Either, failure, success } from '@shared/utils/either.util';

export class ListFlashcardsController extends Controller<
  ListFlashcardsControllerDTO.Parameters,
  ListFlashcardsControllerDTO.Result
> {
  constructor(
    loggerProvider: ISendLogErrorLoggerProvider & ISendLogTimeControllerLoggerProvider,
    private readonly verifyAccessTokenUseCase: UseCase<
      VerifyAccessTokenUseCaseDTO.Parameters,
      VerifyAccessTokenUseCaseDTO.ResultFailure,
      VerifyAccessTokenUseCaseDTO.ResultSuccess
    >,
    private readonly listFlashcardsUseCase: UseCase<
      ListFlashcardsUseCaseDTO.Parameters,
      ListFlashcardsUseCaseDTO.ResultFailure,
      ListFlashcardsUseCaseDTO.ResultSuccess
    >
  ) {
    super(loggerProvider);
  }

  protected async performOperation(
    parameters: ListFlashcardsControllerDTO.Parameters
  ): ListFlashcardsControllerDTO.Result {
    const resultVerifyAccessToken = await this.verifyAccessTokenUseCase.execute({
      accessToken: parameters.access_token
    });
    if (resultVerifyAccessToken.isFailure()) return failure(resultVerifyAccessToken.value);
    const { user } = resultVerifyAccessToken.value;

    const resultListFlashcards = await this.listFlashcardsUseCase.execute({
      collection: {
        id: parameters.headers.collection_id
      },
      user
    });
    if (resultListFlashcards.isFailure()) return failure(resultListFlashcards.value);

    return success({
      status: StatusSuccess.CREATED,
      data: {
        flashcards: resultListFlashcards.value.flashcards
      }
    });
  }
}

export namespace ListFlashcardsControllerDTO {
  export type Parameters = Readonly<
    HttpRequest<
      undefined,
      {
        collection_id: string;
      }
    >
  >;

  type ResultError = Readonly<VerifyAccessTokenUseCaseDTO.ResultFailure | ListFlashcardsUseCaseDTO.ResultFailure>;
  type FlashcardType = Pick<Flashcard, 'id' | 'collection' | 'front'> & {
    responses: Pick<FlashcardResponse, 'text'>[];
  };
  type ResultSuccess = Readonly<
    ResponseSuccess<{
      flashcards: FlashcardType[];
    }>
  >;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}
