import { Controller } from '@application/controllers/_shared/controller';
import {
  CreateCollectionController,
  CreateCollectionControllerDTO
} from '@application/controllers/collections/create-collection.controller';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeCreateCollectionUseCase } from '@factories/use-cases/collections/create-collection-use-case.factory';
import { makeVerifyAccessTokenUseCase } from '@factories/use-cases/users/verify-access-token-use-case.factory';

export const makeCreateCollectionController = (): Controller<
  CreateCollectionControllerDTO.Parameters,
  CreateCollectionControllerDTO.Result
> => new CreateCollectionController(makeLoggerProvider(), makeVerifyAccessTokenUseCase(), makeCreateCollectionUseCase());
