import { StatusError } from '@errors/_shared/status-error';

type ParametersConstructorDTO = {
  collectionCategory: { id: string };
};

export class CollectionCategoryNotFoundError {
  readonly status: StatusError;

  readonly message: string;

  readonly name: 'CollectionCategoryNotFoundError';

  constructor(parameters: ParametersConstructorDTO) {
    this.name = 'CollectionCategoryNotFoundError';
    this.message = `The collection category with id "${parameters.collectionCategory.id}" was not found.`;
    this.status = StatusError.INVALID;
  }
}
