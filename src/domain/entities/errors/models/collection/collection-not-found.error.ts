import { StatusError } from '@errors/_shared/status-error';

type ParametersConstructorDTO = {
  collection: { id: string };
};

export class CollectionNotFoundError {
  readonly status: StatusError;

  readonly message: string;

  readonly name: 'CollectionNotFoundError';

  constructor(parameters: ParametersConstructorDTO) {
    this.name = 'CollectionNotFoundError';
    this.message = `The collection with id "${parameters.collection.id}" was not found.`;
    this.status = StatusError.INVALID;
  }
}
