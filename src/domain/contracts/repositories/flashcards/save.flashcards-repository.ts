import { ProviderError } from '@errors/_shared/provider.error';
import { RepositoryError } from '@errors/_shared/repository.error';

import { Flashcard, FlashcardResponse } from '@models/flashcard.model';

import { Either } from '@shared/utils/either.util';

export namespace SaveFlashcardsRepositoryDTO {
  export type Parameters = Readonly<{
    flashcard: Pick<Flashcard, 'collection' | 'front' | 'owner'> & {
      responses: Pick<FlashcardResponse, 'isCorrect' | 'text'>[];
    };
  }>;

  export type ResultFailure = Readonly<RepositoryError | ProviderError>;
  export type ResultSuccess = Readonly<{
    flashcard: Pick<Flashcard, 'id'>;
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

export interface ISaveFlashcardsRepository {
  save(parameters: SaveFlashcardsRepositoryDTO.Parameters): SaveFlashcardsRepositoryDTO.Result;
}
