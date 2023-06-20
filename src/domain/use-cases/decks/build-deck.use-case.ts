import { ISendLogTimeUseCaseLoggerProvider } from '@contracts/providers/logger/send-log-time-use-case.logger-provider';
import { IFindUnansweredDecksRepository } from '@contracts/repositories/decks/find-unanswered.decks-repository';
import { ISaveDecksRepository } from '@contracts/repositories/decks/save.decks-repository';
import { IFindAnsweredFlashcardsRepository } from '@contracts/repositories/flashcards/find-answered.flashcards-repository';
import { IFindUnansweredFlashcardsRepository } from '@contracts/repositories/flashcards/find-unanswered.flashcards-repository';

import { ProviderError } from '@errors/_shared/provider.error';
import { RepositoryError } from '@errors/_shared/repository.error';
import { NoFlashcardsToBuildDeckError } from '@errors/models/decks/no-flashcards-to-build-deck.error';

import { Collection } from '@models/collection.model';
import { Deck } from '@models/deck.model';
import { Flashcard } from '@models/flashcard.model';
import { User } from '@models/user.model';

import { UseCase } from '@use-cases/_shared/use-case';

import { Either, failure, success } from '@shared/utils/either.util';

export class BuildDeckUseCase extends UseCase<
  BuildDeckUseCaseDTO.Parameters,
  BuildDeckUseCaseDTO.ResultFailure,
  BuildDeckUseCaseDTO.ResultSuccess
> {
  constructor(
    loggerProvider: ISendLogTimeUseCaseLoggerProvider,
    private readonly flashcardsRepository: IFindUnansweredFlashcardsRepository & IFindAnsweredFlashcardsRepository,
    private readonly decksRepository: IFindUnansweredDecksRepository & ISaveDecksRepository
  ) {
    super(loggerProvider);
  }

  protected async performOperation(parameters: BuildDeckUseCaseDTO.Parameters): BuildDeckUseCaseDTO.Result {
    const resultFindUnansweredDeck = await this.decksRepository.findUnanswered({
      deck: {
        collection: { id: parameters.collection.id },
        owner: { id: parameters.user.id }
      }
    });
    if (resultFindUnansweredDeck.isFailure()) return failure(resultFindUnansweredDeck.value);
    const { deckUnanswered } = resultFindUnansweredDeck.value;
    if (deckUnanswered !== undefined) {
      return success({
        deck: {
          id: deckUnanswered.id,
          flashcards: deckUnanswered.flashcards
        }
      });
    }

    const flashcardsToDeck: Pick<Flashcard, 'id'>[] = [];

    const resultFindUnansweredFlashcards = await this.flashcardsRepository.findUnanswered({
      flashcard: {
        collection: { id: parameters.collection.id }
      },
      maxFlashcards: 10
    });
    if (resultFindUnansweredFlashcards.isFailure()) return failure(resultFindUnansweredFlashcards.value);
    const { flashcardsUnanswered } = resultFindUnansweredFlashcards.value;
    if (flashcardsUnanswered.length > 0) {
      flashcardsUnanswered.forEach(flashcard => flashcardsToDeck.push({ id: flashcard.id }));
    }

    const resultFindAnsweredFlashcards = await this.flashcardsRepository.findAnswered({
      flashcard: {
        collection: { id: parameters.collection.id }
      },
      maxFlashcards: 10 - flashcardsUnanswered.length + 10
    });
    if (resultFindAnsweredFlashcards.isFailure()) return failure(resultFindAnsweredFlashcards.value);
    const { flashcardsAnswered } = resultFindAnsweredFlashcards.value;

    if (flashcardsAnswered.length > 0) {
      flashcardsAnswered.forEach(flashcard => flashcardsToDeck.push({ id: flashcard.id }));
    }

    if (flashcardsToDeck.length === 0) return failure(new NoFlashcardsToBuildDeckError());

    const resultSaveDeck = await this.decksRepository.save({
      deck: {
        flashcards: flashcardsToDeck,
        isAnswered: false,
        collection: { id: parameters.collection.id },
        owner: { id: parameters.user.id }
      }
    });
    if (resultSaveDeck.isFailure()) return failure(resultSaveDeck.value);
    const { deckSaved } = resultSaveDeck.value;

    return success({ deck: deckSaved });
  }
}

export namespace BuildDeckUseCaseDTO {
  export type Parameters = Readonly<{
    user: Pick<User, 'id'>;
    collection: Pick<Collection, 'id'>;
  }>;

  export type ResultFailure = Readonly<RepositoryError | ProviderError | NoFlashcardsToBuildDeckError>;
  export type ResultSuccess = Readonly<{
    deck: Pick<Deck, 'id' | 'flashcards'>;
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}
