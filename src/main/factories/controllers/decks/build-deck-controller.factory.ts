import { Controller } from '@application/controllers/_shared/controller';
import { BuildDeckController, BuildDeckControllerDTO } from '@application/controllers/decks/build-deck.controller';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeBuildDeckUseCase } from '@factories/use-cases/decks/build-deck-use-case.factory';
import { makeVerifyAccessTokenUseCase } from '@factories/use-cases/users/verify-access-token-use-case.factory';

export const makeBuildDeckController = (): Controller<BuildDeckControllerDTO.Parameters, BuildDeckControllerDTO.Result> =>
  new BuildDeckController(makeLoggerProvider(), makeVerifyAccessTokenUseCase(), makeBuildDeckUseCase());
