import { RepositoryError } from '@errors/_shared/repository.error';

import { Flashcard, FlashcardResponse } from '@models/flashcard.model';

import { Either } from '@shared/utils/either.util';

export namespace FindByCollectionFlashcardsRepositoryDTO {
  export type Parameters = Readonly<{
    flashcard: Pick<Flashcard, 'collection'>;
  }>;

  export type ResultFailure = Readonly<RepositoryError>;
  export type FlashcardType = Pick<Flashcard, 'id' | 'collection' | 'front'> & {
    responses: Pick<FlashcardResponse, 'text'>[];
  };
  export type ResultSuccess = Readonly<{
    flashcards: FlashcardType[];
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

export interface IFindByCollectionFlashcardsRepository {
  findManyByCollection(
    parameters: FindByCollectionFlashcardsRepositoryDTO.Parameters
  ): FindByCollectionFlashcardsRepositoryDTO.Result;
}
