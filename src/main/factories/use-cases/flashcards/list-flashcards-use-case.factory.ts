import { UseCase } from '@use-cases/_shared/use-case';
import { ListFlashcardsUseCase, ListFlashcardsUseCaseDTO } from '@use-cases/flashcards/list-flashcards.use-case';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeFlashcardsRepository } from '@factories/repositories/flashcards-repository.factory';

export const makeListFlashcardsUseCase = (): UseCase<
  ListFlashcardsUseCaseDTO.Parameters,
  ListFlashcardsUseCaseDTO.ResultFailure,
  ListFlashcardsUseCaseDTO.ResultSuccess
> => new ListFlashcardsUseCase(makeLoggerProvider(), makeFlashcardsRepository());
