import { RepositoryError } from '@errors/_shared/repository.error';

import { CollectionCategory } from '@models/collection-category.model';

import { Either } from '@shared/utils/either.util';

export namespace FindByIdCollectionCategoriesRepositoryDTO {
  export type Parameters = Readonly<{
    collectionCategory: Pick<CollectionCategory, 'id'>;
  }>;

  export type ResultFailure = Readonly<RepositoryError>;
  export type ResultSuccess = Readonly<{
    collectionCategory?: Pick<CollectionCategory, 'id'>;
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

export interface IFindByIdCollectionCategoriesRepository {
  findById(
    parameters: FindByIdCollectionCategoriesRepositoryDTO.Parameters
  ): FindByIdCollectionCategoriesRepositoryDTO.Result;
}
