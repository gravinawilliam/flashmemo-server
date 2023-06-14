import { Controller } from '@application/controllers/_shared/controller';
import {
  ListCollectionsController,
  ListCollectionsControllerDTO
} from '@application/controllers/collections/list-collections.controller';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeListCollectionsUseCase } from '@factories/use-cases/collections/list-collections-use-case.factory';
import { makeVerifyAccessTokenUseCase } from '@factories/use-cases/users/verify-access-token-use-case.factory';

export const makeListCollectionsController = (): Controller<
  ListCollectionsControllerDTO.Parameters,
  ListCollectionsControllerDTO.Result
> => new ListCollectionsController(makeLoggerProvider(), makeVerifyAccessTokenUseCase(), makeListCollectionsUseCase());
