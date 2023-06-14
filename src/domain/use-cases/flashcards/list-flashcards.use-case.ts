import { ISendLogTimeUseCaseLoggerProvider } from '@contracts/providers/logger/send-log-time-use-case.logger-provider';
import { IFindByCollectionFlashcardsRepository } from '@contracts/repositories/flashcards/find-many-by-collection.flashcards-repository';

import { RepositoryError } from '@errors/_shared/repository.error';

import { Collection } from '@models/collection.model';
import { Flashcard, FlashcardResponse } from '@models/flashcard.model';
import { User } from '@models/user.model';

import { UseCase } from '@use-cases/_shared/use-case';

import { Either, failure, success } from '@shared/utils/either.util';

export class ListFlashcardsUseCase extends UseCase<
  ListFlashcardsUseCaseDTO.Parameters,
  ListFlashcardsUseCaseDTO.ResultFailure,
  ListFlashcardsUseCaseDTO.ResultSuccess
> {
  constructor(
    loggerProvider: ISendLogTimeUseCaseLoggerProvider,
    private readonly flashcardsRepository: IFindByCollectionFlashcardsRepository
  ) {
    super(loggerProvider);
  }

  protected async performOperation(parameters: ListFlashcardsUseCaseDTO.Parameters): ListFlashcardsUseCaseDTO.Result {
    const resultFind = await this.flashcardsRepository.findManyByCollection({
      flashcard: { collection: { id: parameters.collection.id } }
    });
    if (resultFind.isFailure()) return failure(resultFind.value);

    return success({ flashcards: resultFind.value.flashcards });
  }
}

export namespace ListFlashcardsUseCaseDTO {
  export type Parameters = Readonly<{
    user: Pick<User, 'id'>;
    collection: Pick<Collection, 'id'>;
  }>;

  export type ResultFailure = Readonly<RepositoryError>;
  type FlashcardType = Pick<Flashcard, 'id' | 'collection' | 'front'> & {
    responses: Pick<FlashcardResponse, 'text'>[];
  };
  export type ResultSuccess = Readonly<{
    flashcards: FlashcardType[];
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}
