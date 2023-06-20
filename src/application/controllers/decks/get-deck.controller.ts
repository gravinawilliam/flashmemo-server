import { Controller, ResponseSuccess, StatusSuccess } from '@application/controllers/_shared/controller';

import { ISendLogErrorLoggerProvider } from '@contracts/providers/logger/send-log-error-logger.provider';
import { ISendLogTimeControllerLoggerProvider } from '@contracts/providers/logger/send-log-time-controller.logger-provider';

import { Flashcard, FlashcardResponse } from '@models/flashcard.model';

import { UseCase } from '@use-cases/_shared/use-case';
import { GetDeckUseCaseDTO } from '@use-cases/decks/get-deck.use-case';
import { VerifyAccessTokenUseCaseDTO } from '@use-cases/users/verify-access-token.use-case';

import { HttpRequest } from '@shared/types/http-request.type';
import { Either, failure, success } from '@shared/utils/either.util';

export class GetDeckController extends Controller<GetDeckControllerDTO.Parameters, GetDeckControllerDTO.Result> {
  constructor(
    loggerProvider: ISendLogErrorLoggerProvider & ISendLogTimeControllerLoggerProvider,
    private readonly verifyAccessTokenUseCase: UseCase<
      VerifyAccessTokenUseCaseDTO.Parameters,
      VerifyAccessTokenUseCaseDTO.ResultFailure,
      VerifyAccessTokenUseCaseDTO.ResultSuccess
    >,
    private readonly getDeckUseCase: UseCase<
      GetDeckUseCaseDTO.Parameters,
      GetDeckUseCaseDTO.ResultFailure,
      GetDeckUseCaseDTO.ResultSuccess
    >
  ) {
    super(loggerProvider);
  }

  protected async performOperation(parameters: GetDeckControllerDTO.Parameters): GetDeckControllerDTO.Result {
    const resultVerifyAccessToken = await this.verifyAccessTokenUseCase.execute({
      accessToken: parameters.access_token
    });
    if (resultVerifyAccessToken.isFailure()) return failure(resultVerifyAccessToken.value);
    const { user } = resultVerifyAccessToken.value;

    const resultBuildDeck = await this.getDeckUseCase.execute({
      user,
      deck: { id: parameters.headers.deck_id }
    });
    if (resultBuildDeck.isFailure()) return failure(resultBuildDeck.value);

    return success({
      status: StatusSuccess.DONE,
      data: {
        deck: resultBuildDeck.value.deck
      }
    });
  }
}

export namespace GetDeckControllerDTO {
  export type Parameters = Readonly<
    HttpRequest<
      undefined,
      {
        deck_id: string;
      }
    >
  >;

  type ResultError = Readonly<VerifyAccessTokenUseCaseDTO.ResultFailure | GetDeckUseCaseDTO.ResultFailure>;
  export type FlashcardType = Pick<Flashcard, 'id' | 'front'> & {
    responses: Pick<FlashcardResponse, 'id' | 'text'>[];
  };
  type ResultSuccess = Readonly<
    ResponseSuccess<{
      deck: {
        id: string;
        collection: {
          id: string;
        };
        flashcards: FlashcardType[];
      };
    }>
  >;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}
