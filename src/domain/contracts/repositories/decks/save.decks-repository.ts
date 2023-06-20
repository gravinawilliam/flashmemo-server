import { ProviderError } from '@errors/_shared/provider.error';
import { RepositoryError } from '@errors/_shared/repository.error';

import { Deck } from '@models/deck.model';

import { Either } from '@shared/utils/either.util';

export namespace SaveDecksRepositoryDTO {
  export type Parameters = Readonly<{
    deck: Pick<Deck, 'flashcards' | 'isAnswered' | 'collection' | 'owner'>;
  }>;

  export type ResultFailure = Readonly<RepositoryError | ProviderError>;
  export type ResultSuccess = Readonly<{
    deckSaved: Pick<Deck, 'id' | 'flashcards'>;
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

export interface ISaveDecksRepository {
  save(parameters: SaveDecksRepositoryDTO.Parameters): SaveDecksRepositoryDTO.Result;
}
