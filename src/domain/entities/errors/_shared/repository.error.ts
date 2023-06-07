import { StatusError } from './status-error';

type ParametersConstructorDTO = {
  error?: Error;
  repository: {
    name: RepositoryNames;
    method: UsersRepositoryMethods;
    externalName?: 'prisma';
  };
};

export enum RepositoryNames {
  USERS = 'users'
}

export enum UsersRepositoryMethods {
  FIND_BY_EMAIL = 'find by email',
  SAVE = 'save'
}

export class RepositoryError {
  readonly status: StatusError;

  readonly message: string;

  readonly name: 'RepositoryError';

  readonly error?: Error;

  constructor(parameters: ParametersConstructorDTO) {
    this.name = 'RepositoryError';
    this.message = `Error in ${parameters.repository.name} repository in ${parameters.repository.method} method.${
      parameters.repository.externalName === undefined
        ? ''
        : ` Error in external lib name: ${parameters.repository.externalName}.`
    }`;
    this.status = StatusError.REPOSITORY_ERROR;
    this.error = parameters.error;
  }
}
