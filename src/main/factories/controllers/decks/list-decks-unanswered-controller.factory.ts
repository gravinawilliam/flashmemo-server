import { Controller } from '@application/controllers/_shared/controller';
import {
  ListDecksUnansweredController,
  ListDecksUnansweredControllerDTO
} from '@application/controllers/decks/list-decks-unanswered.controller';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeListDecksUnansweredUseCase } from '@factories/use-cases/decks/list-decks-unanswered-use-case.factory';
import { makeVerifyAccessTokenUseCase } from '@factories/use-cases/users/verify-access-token-use-case.factory';

export const makeListDecksUnansweredController = (): Controller<
  ListDecksUnansweredControllerDTO.Parameters,
  ListDecksUnansweredControllerDTO.Result
> =>
  new ListDecksUnansweredController(
    makeLoggerProvider(),
    makeVerifyAccessTokenUseCase(),
    makeListDecksUnansweredUseCase()
  );
