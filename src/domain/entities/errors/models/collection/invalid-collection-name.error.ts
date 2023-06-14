import { StatusError } from '@errors/_shared/status-error';

type ParametersConstructorDTO = {
  collection: { name: string };
};

export class InvalidCollectionNameError {
  readonly status: StatusError;

  readonly message: string;

  readonly name: 'InvalidCollectionNameError';

  constructor(parameters: ParametersConstructorDTO) {
    this.name = 'InvalidCollectionNameError';
    this.message = `The collection name "${parameters.collection.name}" is invalid.`;
    this.status = StatusError.INVALID;
  }
}
