import { RepositoryError } from '@errors/_shared/repository.error';

import { Collection } from '@models/collection.model';
import { Deck } from '@models/deck.model';

import { Either } from '@shared/utils/either.util';

export namespace FindAllUnansweredDecksRepositoryDTO {
  export type Parameters = Readonly<{
    deck: Pick<Deck, 'owner'>;
  }>;

  export type ResultFailure = Readonly<RepositoryError>;
  export type DeckUnansweredType = Pick<Deck, 'id'> & {
    collection: Pick<Collection, 'name' | 'id'>;
  };
  export type ResultSuccess = Readonly<{
    decksUnanswered: DeckUnansweredType[];
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

export interface IFindAllUnansweredDecksRepository {
  findAllUnanswered(
    parameters: FindAllUnansweredDecksRepositoryDTO.Parameters
  ): FindAllUnansweredDecksRepositoryDTO.Result;
}
