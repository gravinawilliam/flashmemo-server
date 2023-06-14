import { RepositoryError } from '@errors/_shared/repository.error';
import { InvalidEmailError } from '@errors/value-objects/email/invalid-email.error';

import { User } from '@models/user.model';

import { Either } from '@shared/utils/either.util';

export namespace FindByIdUsersRepositoryDTO {
  export type Parameters = Readonly<{ id: string }>;

  export type ResultError = Readonly<RepositoryError | InvalidEmailError>;
  export type ResultSuccess = {
    user?: Pick<User, 'id'>;
  };

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}

export interface IFindByIdUsersRepository {
  findById(parameters: FindByIdUsersRepositoryDTO.Parameters): FindByIdUsersRepositoryDTO.Result;
}
