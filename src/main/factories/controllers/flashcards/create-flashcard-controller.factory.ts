import { Controller } from '@application/controllers/_shared/controller';
import {
  CreateFlashcardController,
  CreateFlashcardControllerDTO
} from '@application/controllers/flashcards/create-flashcard.controller';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeCreateFlashcardUseCase } from '@factories/use-cases/flashcards/create-flashcard-use-case.factory';
import { makeVerifyAccessTokenUseCase } from '@factories/use-cases/users/verify-access-token-use-case.factory';

export const makeCreateFlashcardController = (): Controller<
  CreateFlashcardControllerDTO.Parameters,
  CreateFlashcardControllerDTO.Result
> => new CreateFlashcardController(makeLoggerProvider(), makeVerifyAccessTokenUseCase(), makeCreateFlashcardUseCase());
