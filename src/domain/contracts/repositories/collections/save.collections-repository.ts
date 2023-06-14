import { ProviderError } from '@errors/_shared/provider.error';
import { RepositoryError } from '@errors/_shared/repository.error';

import { Collection } from '@models/collection.model';

import { Either } from '@shared/utils/either.util';

export namespace SaveCollectionsRepositoryDTO {
  export type Parameters = Readonly<{
    collection: Pick<Collection, 'name' | 'description' | 'privacyStatus' | 'owner' | 'category'>;
  }>;

  export type ResultFailure = Readonly<RepositoryError | ProviderError>;
  export type ResultSuccess = Readonly<{
    collection: Pick<Collection, 'id'>;
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

export interface ISaveCollectionsRepository {
  save(parameters: SaveCollectionsRepositoryDTO.Parameters): SaveCollectionsRepositoryDTO.Result;
}
