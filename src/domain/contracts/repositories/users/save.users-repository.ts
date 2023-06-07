import { ProviderError } from '@errors/_shared/provider.error';
import { RepositoryError } from '@errors/_shared/repository.error';

import { User } from '@models/user.model';

import { Either } from '@shared/utils/either.util';

export namespace SaveUsersRepositoryDTO {
  export type Parameters = Readonly<{
    user: Pick<User, 'email' | 'name' | 'password'>;
  }>;

  export type ResultFailure = Readonly<RepositoryError | ProviderError>;
  export type ResultSuccess = Readonly<{
    user: Pick<User, 'id'>;
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

export interface ISaveUsersRepository {
  save(parameters: SaveUsersRepositoryDTO.Parameters): SaveUsersRepositoryDTO.Result;
}
