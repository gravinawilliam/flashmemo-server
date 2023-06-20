import { Controller, ResponseSuccess, StatusSuccess } from '@application/controllers/_shared/controller';

import { ISendLogErrorLoggerProvider } from '@contracts/providers/logger/send-log-error-logger.provider';
import { ISendLogTimeControllerLoggerProvider } from '@contracts/providers/logger/send-log-time-controller.logger-provider';

import { UseCase } from '@use-cases/_shared/use-case';
import { AnswerDeckUseCaseDTO } from '@use-cases/decks/answer-deck.use-case';
import { BuildDeckUseCaseDTO } from '@use-cases/decks/build-deck.use-case';
import { VerifyAccessTokenUseCaseDTO } from '@use-cases/users/verify-access-token.use-case';

import { HttpRequest } from '@shared/types/http-request.type';
import { Either, failure, success } from '@shared/utils/either.util';

export class AnswerDeckController extends Controller<AnswerDeckControllerDTO.Parameters, AnswerDeckControllerDTO.Result> {
  constructor(
    loggerProvider: ISendLogErrorLoggerProvider & ISendLogTimeControllerLoggerProvider,
    private readonly verifyAccessTokenUseCase: UseCase<
      VerifyAccessTokenUseCaseDTO.Parameters,
      VerifyAccessTokenUseCaseDTO.ResultFailure,
      VerifyAccessTokenUseCaseDTO.ResultSuccess
    >,
    private readonly answerDeckUseCase: UseCase<
      AnswerDeckUseCaseDTO.Parameters,
      AnswerDeckUseCaseDTO.ResultFailure,
      AnswerDeckUseCaseDTO.ResultSuccess
    >,
    private readonly buildDeckUseCase: UseCase<
      BuildDeckUseCaseDTO.Parameters,
      BuildDeckUseCaseDTO.ResultFailure,
      BuildDeckUseCaseDTO.ResultSuccess
    >
  ) {
    super(loggerProvider);
  }

  protected async performOperation(parameters: AnswerDeckControllerDTO.Parameters): AnswerDeckControllerDTO.Result {
    const resultVerifyAccessToken = await this.verifyAccessTokenUseCase.execute({
      accessToken: parameters.access_token
    });
    if (resultVerifyAccessToken.isFailure()) return failure(resultVerifyAccessToken.value);
    const { user } = resultVerifyAccessToken.value;

    const resultAnswerDeck = await this.answerDeckUseCase.execute({
      user,
      deck: {
        id: parameters.body.deck.id,
        flashcards: parameters.body.deck.flashcards
      }
    });
    if (resultAnswerDeck.isFailure()) return failure(resultAnswerDeck.value);

    const resultBuildDeck = await this.buildDeckUseCase.execute({
      user,
      collection: {
        id: resultAnswerDeck.value.deck.collection.id
      }
    });
    if (resultBuildDeck.isFailure()) return failure(resultBuildDeck.value);

    return success({
      status: StatusSuccess.DONE,
      data: {
        deck: resultAnswerDeck.value.deck
      }
    });
  }
}

export namespace AnswerDeckControllerDTO {
  export type Parameters = Readonly<
    HttpRequest<
      {
        deck: {
          id: string;
          flashcards: {
            id: string;
            responseId: string;
          }[];
        };
      },
      undefined
    >
  >;

  type ResultError = Readonly<
    VerifyAccessTokenUseCaseDTO.ResultFailure | AnswerDeckUseCaseDTO.ResultFailure | BuildDeckUseCaseDTO.ResultFailure
  >;
  type ResultSuccess = Readonly<
    ResponseSuccess<{
      deck: {
        collection: {
          id: string;
        };
        flashcards: {
          id: string;
          isWinner: boolean;
        }[];
      };
    }>
  >;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}
