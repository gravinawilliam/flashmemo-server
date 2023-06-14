import { ISendLogTimeUseCaseLoggerProvider } from '@contracts/providers/logger/send-log-time-use-case.logger-provider';
import { IFindManyByOwnerCollectionsRepository } from '@contracts/repositories/collections/find-many-by-owner.collections-repository';

import { RepositoryError } from '@errors/_shared/repository.error';

import { CollectionCategory } from '@models/collection-category.model';
import { Collection } from '@models/collection.model';
import { User } from '@models/user.model';

import { UseCase } from '@use-cases/_shared/use-case';

import { Either, failure, success } from '@shared/utils/either.util';

export class ListCollectionsUseCase extends UseCase<
  ListCollectionsUseCaseDTO.Parameters,
  ListCollectionsUseCaseDTO.ResultFailure,
  ListCollectionsUseCaseDTO.ResultSuccess
> {
  constructor(
    loggerProvider: ISendLogTimeUseCaseLoggerProvider,
    private readonly collectionsRepository: IFindManyByOwnerCollectionsRepository
  ) {
    super(loggerProvider);
  }

  protected async performOperation(parameters: ListCollectionsUseCaseDTO.Parameters): ListCollectionsUseCaseDTO.Result {
    const resultFindCollection = await this.collectionsRepository.findManyByOwner({
      collection: { owner: { id: parameters.user.id } }
    });
    if (resultFindCollection.isFailure()) return failure(resultFindCollection.value);

    const { collections } = resultFindCollection.value;
    return success({ collections });
  }
}

export namespace ListCollectionsUseCaseDTO {
  export type Parameters = Readonly<{
    user: Pick<User, 'id'>;
  }>;

  export type ResultFailure = Readonly<RepositoryError>;
  type Collections = Pick<Collection, 'id' | 'name' | 'privacyStatus' | 'description'> & {
    category: Pick<CollectionCategory, 'id' | 'name'>;
  };
  export type ResultSuccess = Readonly<{
    collections: Collections[];
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}
