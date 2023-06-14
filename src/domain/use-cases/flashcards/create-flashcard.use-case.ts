import { ISendLogTimeUseCaseLoggerProvider } from '@contracts/providers/logger/send-log-time-use-case.logger-provider';
import { IFindByIdCollectionsRepository } from '@contracts/repositories/collections/find-by-id.collections-repository';
import { ISaveFlashcardsRepository } from '@contracts/repositories/flashcards/save.flashcards-repository';

import { ProviderError } from '@errors/_shared/provider.error';
import { RepositoryError } from '@errors/_shared/repository.error';
import { CollectionNotFoundError } from '@errors/models/collection/collection-not-found.error';
import { FlashcardWithoutCorrectResponseError } from '@errors/models/flashcard/flashcard-without-correct-response.error';
import { InvalidFlashcardFrontError } from '@errors/models/flashcard/invalid-flashcard-front.error';

import { Collection } from '@models/collection.model';
import { Flashcard } from '@models/flashcard.model';
import { User } from '@models/user.model';

import { UseCase } from '@use-cases/_shared/use-case';

import { Either, failure, success } from '@shared/utils/either.util';

export class CreateFlashcardUseCase extends UseCase<
  CreateFlashcardUseCaseDTO.Parameters,
  CreateFlashcardUseCaseDTO.ResultFailure,
  CreateFlashcardUseCaseDTO.ResultSuccess
> {
  constructor(
    loggerProvider: ISendLogTimeUseCaseLoggerProvider,
    private readonly collectionsRepository: IFindByIdCollectionsRepository,
    private readonly flashcardsRepository: ISaveFlashcardsRepository
  ) {
    super(loggerProvider);
  }

  protected async performOperation(parameters: CreateFlashcardUseCaseDTO.Parameters): CreateFlashcardUseCaseDTO.Result {
    const flashcardFront = parameters.flashcard.front.trim();
    if (flashcardFront.length < 5 || flashcardFront.length > 300) {
      return failure(new InvalidFlashcardFrontError());
    }

    let hasCorrectResponse = false;
    const flashcardResponses = parameters.flashcard.responses.map(response => {
      if (response.isCorrect) hasCorrectResponse = true;
      return {
        text: response.text.trim(),
        isCorrect: response.isCorrect
      };
    });
    if (hasCorrectResponse === false) return failure(new FlashcardWithoutCorrectResponseError());

    const resultFindByIdCollection = await this.collectionsRepository.findById({
      collection: {
        id: parameters.collection.id,
        owner: {
          id: parameters.user.id
        }
      }
    });
    if (resultFindByIdCollection.isFailure()) return failure(resultFindByIdCollection.value);
    const { collection } = resultFindByIdCollection.value;
    if (collection === undefined) {
      return failure(
        new CollectionNotFoundError({
          collection: {
            id: parameters.collection.id
          }
        })
      );
    }

    const resultSaveFlashcard = await this.flashcardsRepository.save({
      flashcard: {
        front: flashcardFront,
        responses: flashcardResponses,
        collection: {
          id: collection.id
        },
        owner: {
          id: parameters.user.id
        }
      }
    });
    if (resultSaveFlashcard.isFailure()) return failure(resultSaveFlashcard.value);

    return success({ flashcard: { id: resultSaveFlashcard.value.flashcard.id } });
  }
}

export namespace CreateFlashcardUseCaseDTO {
  export type Parameters = Readonly<{
    user: Pick<User, 'id'>;
    collection: Pick<Collection, 'id'>;
    flashcard: {
      front: string;
      responses: {
        text: string;
        isCorrect: boolean;
      }[];
    };
  }>;

  export type ResultFailure = Readonly<
    | RepositoryError
    | ProviderError
    | CollectionNotFoundError
    | FlashcardWithoutCorrectResponseError
    | InvalidFlashcardFrontError
  >;
  export type ResultSuccess = Readonly<{
    flashcard: Pick<Flashcard, 'id'>;
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}
