import { RepositoryError } from '@errors/_shared/repository.error';

import { Flashcard } from '@models/flashcard.model';

import { Either } from '@shared/utils/either.util';

export namespace FindUnansweredFlashcardsRepositoryDTO {
  export type Parameters = Readonly<{
    flashcard: Pick<Flashcard, 'collection'>;
    maxFlashcards: number;
  }>;

  export type ResultFailure = Readonly<RepositoryError>;
  export type ResultSuccess = Readonly<{
    flashcardsUnanswered: Pick<Flashcard, 'id'>[];
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

export interface IFindUnansweredFlashcardsRepository {
  findUnanswered(
    parameters: FindUnansweredFlashcardsRepositoryDTO.Parameters
  ): FindUnansweredFlashcardsRepositoryDTO.Result;
}
