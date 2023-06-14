import { UseCase } from '@use-cases/_shared/use-case';
import { CreateFlashcardUseCase, CreateFlashcardUseCaseDTO } from '@use-cases/flashcards/create-flashcard.use-case';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeCollectionsRepository } from '@factories/repositories/collections-repository.factory';
import { makeFlashcardsRepository } from '@factories/repositories/flashcards-repository.factory';

export const makeCreateFlashcardUseCase = (): UseCase<
  CreateFlashcardUseCaseDTO.Parameters,
  CreateFlashcardUseCaseDTO.ResultFailure,
  CreateFlashcardUseCaseDTO.ResultSuccess
> => new CreateFlashcardUseCase(makeLoggerProvider(), makeCollectionsRepository(), makeFlashcardsRepository());
