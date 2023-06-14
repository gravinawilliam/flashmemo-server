import { Controller, ResponseSuccess, StatusSuccess } from '@application/controllers/_shared/controller';

import { ISendLogErrorLoggerProvider } from '@contracts/providers/logger/send-log-error-logger.provider';
import { ISendLogTimeControllerLoggerProvider } from '@contracts/providers/logger/send-log-time-controller.logger-provider';

import { Collection } from '@models/collection.model';
import { Flashcard } from '@models/flashcard.model';

import { UseCase } from '@use-cases/_shared/use-case';
import { CreateFlashcardUseCaseDTO } from '@use-cases/flashcards/create-flashcard.use-case';
import { VerifyAccessTokenUseCaseDTO } from '@use-cases/users/verify-access-token.use-case';

import { HttpRequest } from '@shared/types/http-request.type';
import { Either, failure, success } from '@shared/utils/either.util';

export class CreateFlashcardController extends Controller<
  CreateFlashcardControllerDTO.Parameters,
  CreateFlashcardControllerDTO.Result
> {
  constructor(
    loggerProvider: ISendLogErrorLoggerProvider & ISendLogTimeControllerLoggerProvider,
    private readonly verifyAccessTokenUseCase: UseCase<
      VerifyAccessTokenUseCaseDTO.Parameters,
      VerifyAccessTokenUseCaseDTO.ResultFailure,
      VerifyAccessTokenUseCaseDTO.ResultSuccess
    >,
    private readonly createFlashcardUseCase: UseCase<
      CreateFlashcardUseCaseDTO.Parameters,
      CreateFlashcardUseCaseDTO.ResultFailure,
      CreateFlashcardUseCaseDTO.ResultSuccess
    >
  ) {
    super(loggerProvider);
  }

  protected async performOperation(
    parameters: CreateFlashcardControllerDTO.Parameters
  ): CreateFlashcardControllerDTO.Result {
    const resultVerifyAccessToken = await this.verifyAccessTokenUseCase.execute({
      accessToken: parameters.access_token
    });
    if (resultVerifyAccessToken.isFailure()) return failure(resultVerifyAccessToken.value);
    const { user } = resultVerifyAccessToken.value;

    const resultCreateFlashcard = await this.createFlashcardUseCase.execute({
      flashcard: {
        front: parameters.body.flashcard.front,
        responses: parameters.body.flashcard.responses
      },
      collection: parameters.body.collection,
      user
    });
    if (resultCreateFlashcard.isFailure()) return failure(resultCreateFlashcard.value);

    return success({
      status: StatusSuccess.CREATED,
      data: {
        flashcard: resultCreateFlashcard.value.flashcard
      }
    });
  }
}

export namespace CreateFlashcardControllerDTO {
  export type Parameters = Readonly<
    HttpRequest<{
      collection: Pick<Collection, 'id'>;
      flashcard: {
        front: string;
        responses: {
          text: string;
          isCorrect: boolean;
        }[];
      };
    }>
  >;

  type ResultError = Readonly<VerifyAccessTokenUseCaseDTO.ResultFailure | CreateFlashcardUseCaseDTO.ResultFailure>;
  type ResultSuccess = Readonly<
    ResponseSuccess<{
      flashcard: Pick<Flashcard, 'id'>;
    }>
  >;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}
