import { UseCase } from '@use-cases/_shared/use-case';
import { CreateCollectionUseCase, CreateCollectionUseCaseDTO } from '@use-cases/collections/create-collection.use-case';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeCollectionCategoriesRepository } from '@factories/repositories/collection-categories-repository.factory';
import { makeCollectionsRepository } from '@factories/repositories/collections-repository.factory';

export const makeCreateCollectionUseCase = (): UseCase<
  CreateCollectionUseCaseDTO.Parameters,
  CreateCollectionUseCaseDTO.ResultFailure,
  CreateCollectionUseCaseDTO.ResultSuccess
> => new CreateCollectionUseCase(makeLoggerProvider(), makeCollectionCategoriesRepository(), makeCollectionsRepository());
