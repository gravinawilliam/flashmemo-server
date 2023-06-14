import { RepositoryError } from '@errors/_shared/repository.error';

import { Collection } from '@models/collection.model';

import { Either } from '@shared/utils/either.util';

export namespace FindByIdCollectionsRepositoryDTO {
  export type Parameters = Readonly<{
    collection: Pick<Collection, 'owner' | 'id'>;
  }>;

  export type ResultFailure = Readonly<RepositoryError>;
  export type ResultSuccess = Readonly<{
    collection?: Pick<Collection, 'owner' | 'id'>;
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

export interface IFindByIdCollectionsRepository {
  findById(parameters: FindByIdCollectionsRepositoryDTO.Parameters): FindByIdCollectionsRepositoryDTO.Result;
}
