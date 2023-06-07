import { RepositoryError } from '@errors/_shared/repository.error';
import { InvalidEmailError } from '@errors/value-objects/email/invalid-email.error';

import { User } from '@models/user.model';

import { Either } from '@shared/utils/either.util';

export namespace FindByEmailUsersRepositoryDTO {
  export type Parameters = Readonly<{
    user: Pick<User, 'email'>;
  }>;

  export type ResultFailure = Readonly<RepositoryError | InvalidEmailError>;
  export type ResultSuccess = Readonly<{
    user?: Pick<User, 'id' | 'email' | 'password'>;
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

export interface IFindByEmailUsersRepository {
  findByEmail(parameters: FindByEmailUsersRepositoryDTO.Parameters): FindByEmailUsersRepositoryDTO.Result;
}
