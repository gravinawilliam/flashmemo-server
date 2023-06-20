import { RepositoryError } from '@errors/_shared/repository.error';

import { Deck } from '@models/deck.model';
import { Flashcard, FlashcardResponse } from '@models/flashcard.model';

import { Either } from '@shared/utils/either.util';

export namespace FindDeckAndResponsesDecksRepositoryDTO {
  export type Parameters = Readonly<{
    deck: Pick<Deck, 'owner' | 'id'>;
  }>;

  export type ResultFailure = Readonly<RepositoryError>;
  export type FlashcardType = Pick<Flashcard, 'id' | 'front'> & {
    responses: Pick<FlashcardResponse, 'isCorrect' | 'id' | 'text'>[];
  };
  export type DeckType = Pick<Deck, 'id' | 'collection'> & {
    flashcards: FlashcardType[];
  };
  export type ResultSuccess = Readonly<{
    deck?: DeckType;
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

export interface IFindDeckAndResponsesDecksRepository {
  findDeckAndResponses(
    parameters: FindDeckAndResponsesDecksRepositoryDTO.Parameters
  ): FindDeckAndResponsesDecksRepositoryDTO.Result;
}
