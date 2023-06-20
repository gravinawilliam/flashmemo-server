import { RepositoryError } from '@errors/_shared/repository.error';

import { Deck } from '@models/deck.model';

import { Either } from '@shared/utils/either.util';

export namespace FindUnansweredDecksRepositoryDTO {
  export type Parameters = Readonly<{
    deck: Pick<Deck, 'owner' | 'collection'>;
  }>;

  export type ResultFailure = Readonly<RepositoryError>;
  export type ResultSuccess = Readonly<{
    deckUnanswered?: Pick<Deck, 'id' | 'flashcards'>;
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

export interface IFindUnansweredDecksRepository {
  findUnanswered(parameters: FindUnansweredDecksRepositoryDTO.Parameters): FindUnansweredDecksRepositoryDTO.Result;
}
