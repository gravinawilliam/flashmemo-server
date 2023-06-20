import { RepositoryError } from '@errors/_shared/repository.error';

import { Flashcard } from '@models/flashcard.model';

import { Either } from '@shared/utils/either.util';

export namespace FindAnsweredFlashcardsRepositoryDTO {
  export type Parameters = Readonly<{
    flashcard: Pick<Flashcard, 'collection'>;
    maxFlashcards: number;
  }>;

  export type ResultFailure = Readonly<RepositoryError>;
  export type ResultSuccess = Readonly<{
    flashcardsAnswered: Pick<Flashcard, 'id'>[];
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

export interface IFindAnsweredFlashcardsRepository {
  findAnswered(parameters: FindAnsweredFlashcardsRepositoryDTO.Parameters): FindAnsweredFlashcardsRepositoryDTO.Result;
}
