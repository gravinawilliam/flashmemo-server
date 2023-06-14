import { UseCase } from '@use-cases/_shared/use-case';
import { ListCollectionsUseCase, ListCollectionsUseCaseDTO } from '@use-cases/collections/list-collections.use-case';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeCollectionsRepository } from '@factories/repositories/collections-repository.factory';

export const makeListCollectionsUseCase = (): UseCase<
  ListCollectionsUseCaseDTO.Parameters,
  ListCollectionsUseCaseDTO.ResultFailure,
  ListCollectionsUseCaseDTO.ResultSuccess
> => new ListCollectionsUseCase(makeLoggerProvider(), makeCollectionsRepository());
