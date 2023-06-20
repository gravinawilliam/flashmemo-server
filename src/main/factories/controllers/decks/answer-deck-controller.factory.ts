import { Controller } from '@application/controllers/_shared/controller';
import { AnswerDeckController, AnswerDeckControllerDTO } from '@application/controllers/decks/answer-deck.controller';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeAnswerDeckUseCase } from '@factories/use-cases/decks/answer-deck-use-case.factory';
import { makeBuildDeckUseCase } from '@factories/use-cases/decks/build-deck-use-case.factory';
import { makeVerifyAccessTokenUseCase } from '@factories/use-cases/users/verify-access-token-use-case.factory';

export const makeAnswerDeckController = (): Controller<
  AnswerDeckControllerDTO.Parameters,
  AnswerDeckControllerDTO.Result
> =>
  new AnswerDeckController(
    makeLoggerProvider(),
    makeVerifyAccessTokenUseCase(),
    makeAnswerDeckUseCase(),
    makeBuildDeckUseCase()
  );
