import { UseCase } from '@use-cases/_shared/use-case';
import { BuildDeckUseCaseDTO, BuildDeckUseCase } from '@use-cases/decks/build-deck.use-case';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeDecksRepository } from '@factories/repositories/decks-repository.factory';
import { makeFlashcardsRepository } from '@factories/repositories/flashcards-repository.factory';

export const makeBuildDeckUseCase = (): UseCase<
  BuildDeckUseCaseDTO.Parameters,
  BuildDeckUseCaseDTO.ResultFailure,
  BuildDeckUseCaseDTO.ResultSuccess
> => new BuildDeckUseCase(makeLoggerProvider(), makeFlashcardsRepository(), makeDecksRepository());
