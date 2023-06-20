import { ISendLogTimeUseCaseLoggerProvider } from '@contracts/providers/logger/send-log-time-use-case.logger-provider';
import { IFindDeckAndResponsesDecksRepository } from '@contracts/repositories/decks/find-deck-and-responses.decks-repository';

import { ProviderError } from '@errors/_shared/provider.error';
import { RepositoryError } from '@errors/_shared/repository.error';
import { DeckNotFoundError } from '@errors/models/decks/deck-not-found.error';

import { Flashcard, FlashcardResponse } from '@models/flashcard.model';
import { User } from '@models/user.model';

import { UseCase } from '@use-cases/_shared/use-case';

import { Either, failure, success } from '@shared/utils/either.util';

export class GetDeckUseCase extends UseCase<
  GetDeckUseCaseDTO.Parameters,
  GetDeckUseCaseDTO.ResultFailure,
  GetDeckUseCaseDTO.ResultSuccess
> {
  constructor(
    loggerProvider: ISendLogTimeUseCaseLoggerProvider,
    private readonly decksRepository: IFindDeckAndResponsesDecksRepository
  ) {
    super(loggerProvider);
  }

  protected async performOperation(parameters: GetDeckUseCaseDTO.Parameters): GetDeckUseCaseDTO.Result {
    const resultFindDeck = await this.decksRepository.findDeckAndResponses({
      deck: {
        id: parameters.deck.id,
        owner: { id: parameters.user.id }
      }
    });
    if (resultFindDeck.isFailure()) return failure(resultFindDeck.value);
    const { deck } = resultFindDeck.value;
    if (deck === undefined) return failure(new DeckNotFoundError({ deck: { id: parameters.deck.id } }));

    const flashcards: GetDeckUseCaseDTO.FlashcardType[] = deck.flashcards.map(flashcard => ({
      id: flashcard.id,
      front: flashcard.front,
      responses: flashcard.responses.map(response => ({ id: response.id, text: response.text }))
    }));

    return success({
      deck: {
        id: deck.id,
        collection: { id: deck.collection.id },
        flashcards
      }
    });
  }
}

export namespace GetDeckUseCaseDTO {
  export type Parameters = Readonly<{
    user: Pick<User, 'id'>;
    deck: {
      id: string;
    };
  }>;

  export type ResultFailure = Readonly<RepositoryError | ProviderError | DeckNotFoundError>;
  export type FlashcardType = Pick<Flashcard, 'id' | 'front'> & {
    responses: Pick<FlashcardResponse, 'id' | 'text'>[];
  };
  export type ResultSuccess = Readonly<{
    deck: {
      id: string;
      collection: {
        id: string;
      };
      flashcards: FlashcardType[];
    };
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}
