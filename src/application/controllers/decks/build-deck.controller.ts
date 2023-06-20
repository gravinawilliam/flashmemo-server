import { Controller, ResponseSuccess, StatusSuccess } from '@application/controllers/_shared/controller';

import { ISendLogErrorLoggerProvider } from '@contracts/providers/logger/send-log-error-logger.provider';
import { ISendLogTimeControllerLoggerProvider } from '@contracts/providers/logger/send-log-time-controller.logger-provider';

import { UseCase } from '@use-cases/_shared/use-case';
import { BuildDeckUseCaseDTO } from '@use-cases/decks/build-deck.use-case';
import { VerifyAccessTokenUseCaseDTO } from '@use-cases/users/verify-access-token.use-case';

import { HttpRequest } from '@shared/types/http-request.type';
import { Either, failure, success } from '@shared/utils/either.util';

export class BuildDeckController extends Controller<BuildDeckControllerDTO.Parameters, BuildDeckControllerDTO.Result> {
  constructor(
    loggerProvider: ISendLogErrorLoggerProvider & ISendLogTimeControllerLoggerProvider,
    private readonly verifyAccessTokenUseCase: UseCase<
      VerifyAccessTokenUseCaseDTO.Parameters,
      VerifyAccessTokenUseCaseDTO.ResultFailure,
      VerifyAccessTokenUseCaseDTO.ResultSuccess
    >,
    private readonly buildDeckUseCase: UseCase<
      BuildDeckUseCaseDTO.Parameters,
      BuildDeckUseCaseDTO.ResultFailure,
      BuildDeckUseCaseDTO.ResultSuccess
    >
  ) {
    super(loggerProvider);
  }

  protected async performOperation(parameters: BuildDeckControllerDTO.Parameters): BuildDeckControllerDTO.Result {
    const resultVerifyAccessToken = await this.verifyAccessTokenUseCase.execute({
      accessToken: parameters.access_token
    });
    if (resultVerifyAccessToken.isFailure()) return failure(resultVerifyAccessToken.value);
    const { user } = resultVerifyAccessToken.value;

    const resultBuildDeck = await this.buildDeckUseCase.execute({
      user,
      collection: {
        id: parameters.body.collection.id
      }
    });
    if (resultBuildDeck.isFailure()) return failure(resultBuildDeck.value);

    return success({
      status: StatusSuccess.DONE,
      data: {
        deck: {
          flashcards: resultBuildDeck.value.deck.flashcards,
          id: resultBuildDeck.value.deck.id
        }
      }
    });
  }
}

export namespace BuildDeckControllerDTO {
  export type Parameters = Readonly<
    HttpRequest<
      {
        collection: {
          id: string;
        };
      },
      undefined
    >
  >;

  type ResultError = Readonly<VerifyAccessTokenUseCaseDTO.ResultFailure | BuildDeckUseCaseDTO.ResultFailure>;
  type ResultSuccess = Readonly<
    ResponseSuccess<{
      deck: {
        id: string;
        flashcards: {
          id: string;
        }[];
      };
    }>
  >;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}
