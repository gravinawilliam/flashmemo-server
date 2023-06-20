import { RepositoryError } from '@errors/_shared/repository.error';

import { Deck } from '@models/deck.model';

import { Either } from '@shared/utils/either.util';

export namespace UpdateDecksRepositoryDTO {
  export type Parameters = Readonly<{
    deck: Pick<Deck, 'id' | 'isAnswered'> & {
      flashcards: { id: string; isWinner: boolean }[];
    };
  }>;

  export type ResultFailure = Readonly<RepositoryError>;
  export type ResultSuccess = Readonly<undefined>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

export interface IUpdateDecksRepository {
  update(parameters: UpdateDecksRepositoryDTO.Parameters): UpdateDecksRepositoryDTO.Result;
}
