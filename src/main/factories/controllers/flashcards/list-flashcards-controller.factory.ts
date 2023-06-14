import { Controller } from '@application/controllers/_shared/controller';
import {
  ListFlashcardsController,
  ListFlashcardsControllerDTO
} from '@application/controllers/flashcards/list-flashcards.controller';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeListFlashcardsUseCase } from '@factories/use-cases/flashcards/list-flashcards-use-case.factory';
import { makeVerifyAccessTokenUseCase } from '@factories/use-cases/users/verify-access-token-use-case.factory';

export const makeListFlashcardsController = (): Controller<
  ListFlashcardsControllerDTO.Parameters,
  ListFlashcardsControllerDTO.Result
> => new ListFlashcardsController(makeLoggerProvider(), makeVerifyAccessTokenUseCase(), makeListFlashcardsUseCase());
