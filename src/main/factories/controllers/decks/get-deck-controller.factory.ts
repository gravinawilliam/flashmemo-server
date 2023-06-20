import { Controller } from '@application/controllers/_shared/controller';
import { GetDeckController, GetDeckControllerDTO } from '@application/controllers/decks/get-deck.controller';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeGetDeckUseCase } from '@factories/use-cases/decks/get-deck-use-case.factory';
import { makeVerifyAccessTokenUseCase } from '@factories/use-cases/users/verify-access-token-use-case.factory';

export const makeGetDeckController = (): Controller<GetDeckControllerDTO.Parameters, GetDeckControllerDTO.Result> =>
  new GetDeckController(makeLoggerProvider(), makeVerifyAccessTokenUseCase(), makeGetDeckUseCase());
