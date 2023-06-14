/* eslint-disable sonarjs/no-duplicate-string */
import { StatusError } from './status-error';

type ParametersConstructorDTO = {
  error?: Error;
  repository: {
    name: RepositoryNames;
    method:
      | UsersRepositoryMethods
      | CollectionCategoriesRepositoryMethods
      | CollectionsRepositoryMethods
      | FlashcardsRepositoryMethods;
    externalName?: 'prisma';
  };
};

export enum RepositoryNames {
  USERS = 'users',
  FLASHCARDS = 'flashcards',
  COLLECTIONS = 'collections',
  COLLECTION_CATEGORIES = 'collection categories'
}

export enum UsersRepositoryMethods {
  FIND_BY_EMAIL = 'find by email',
  FIND_BY_ID = 'find by id',
  SAVE = 'save'
}

export enum CollectionCategoriesRepositoryMethods {
  FIND_BY_ID = 'find by id'
}

export enum CollectionsRepositoryMethods {
  FIND_BY_ID = 'find by id',
  FIND_MANY_BY_OWNER = 'find many by owner',
  SAVE = 'save'
}

export enum FlashcardsRepositoryMethods {
  FIND_MANY_BY_COLLECTION = 'find many by collection',
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
