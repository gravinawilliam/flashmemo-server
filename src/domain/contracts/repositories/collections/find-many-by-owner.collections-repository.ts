import { RepositoryError } from '@errors/_shared/repository.error';

import { CollectionCategory } from '@models/collection-category.model';
import { Collection } from '@models/collection.model';

import { Either } from '@shared/utils/either.util';

export namespace FindManyByOwnerCollectionsRepositoryDTO {
  export type Parameters = Readonly<{
    collection: Pick<Collection, 'owner'>;
  }>;

  export type ResultFailure = Readonly<RepositoryError>;
  export type Collections = Pick<Collection, 'id' | 'description' | 'name' | 'owner' | 'privacyStatus'> & {
    category: Pick<CollectionCategory, 'id' | 'name'>;
  };
  export type ResultSuccess = Readonly<{
    collections: Collections[];
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

export interface IFindManyByOwnerCollectionsRepository {
  findManyByOwner(
    parameters: FindManyByOwnerCollectionsRepositoryDTO.Parameters
  ): FindManyByOwnerCollectionsRepositoryDTO.Result;
}
