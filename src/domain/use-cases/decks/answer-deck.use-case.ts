import { ISendLogTimeUseCaseLoggerProvider } from '@contracts/providers/logger/send-log-time-use-case.logger-provider';
import { IFindDecksRepository } from '@contracts/repositories/decks/find.decks-repository';
import { IUpdateDecksRepository } from '@contracts/repositories/decks/update.decks-repository';

import { ProviderError } from '@errors/_shared/provider.error';
import { RepositoryError } from '@errors/_shared/repository.error';
import { DeckNotFoundError } from '@errors/models/decks/deck-not-found.error';

import { User } from '@models/user.model';

import { UseCase } from '@use-cases/_shared/use-case';

import { Either, failure, success } from '@shared/utils/either.util';

export class AnswerDeckUseCase extends UseCase<
  AnswerDeckUseCaseDTO.Parameters,
  AnswerDeckUseCaseDTO.ResultFailure,
  AnswerDeckUseCaseDTO.ResultSuccess
> {
  constructor(
    loggerProvider: ISendLogTimeUseCaseLoggerProvider,
    private readonly decksRepository: IFindDecksRepository & IUpdateDecksRepository
  ) {
    super(loggerProvider);
  }

  protected async performOperation(parameters: AnswerDeckUseCaseDTO.Parameters): AnswerDeckUseCaseDTO.Result {
    const resultFindDeck = await this.decksRepository.find({
      deck: {
        id: parameters.deck.id,
        owner: { id: parameters.user.id }
      }
    });
    if (resultFindDeck.isFailure()) return failure(resultFindDeck.value);
    const { deck } = resultFindDeck.value;
    if (deck === undefined) return failure(new DeckNotFoundError({ deck: { id: parameters.deck.id } }));

    const flashcards: {
      id: string;
      isWinner: boolean;
    }[] = deck.flashcards.map(flashcard => {
      const isWinner = flashcard.response.id === parameters.deck.flashcards.find(f => f.id === flashcard.id)?.responseId;

      return {
        isWinner,
        id: flashcard.id
      };
    });

    const resultUpdateDeck = await this.decksRepository.update({
      deck: {
        flashcards,
        isAnswered: true,
        id: deck.id
      }
    });
    if (resultUpdateDeck.isFailure()) return failure(resultUpdateDeck.value);

    return success({
      deck: {
        collection: { id: deck.collection.id },
        flashcards
      }
    });
  }
}

export namespace AnswerDeckUseCaseDTO {
  export type Parameters = Readonly<{
    user: Pick<User, 'id'>;
    deck: {
      id: string;
      flashcards: {
        id: string;
        responseId: string;
      }[];
    };
  }>;

  export type ResultFailure = Readonly<RepositoryError | ProviderError | DeckNotFoundError>;
  export type ResultSuccess = Readonly<{
    deck: {
      collection: {
        id: string;
      };
      flashcards: {
        id: string;
        isWinner: boolean;
      }[];
    };
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}
