import { StatusError } from '@errors/_shared/status-error';

type ParametersConstructorDTO = {
  collection: { description: string };
};

export class InvalidCollectionDescriptionError {
  readonly status: StatusError;

  readonly message: string;

  readonly name: 'InvalidCollectionDescriptionError';

  constructor(parameters: ParametersConstructorDTO) {
    this.name = 'InvalidCollectionDescriptionError';
    this.message = `The collection description "${parameters.collection.description}" is invalid.`;
    this.status = StatusError.INVALID;
  }
}
