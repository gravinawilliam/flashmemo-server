import { StatusError } from '@errors/_shared/status-error';

type ParametersConstructorDTO = {
  privacyStatus: string;
};

export class InvalidCollectionPrivacyStatusError {
  readonly status: StatusError;

  readonly message: string;

  readonly name: 'InvalidCollectionPrivacyStatusError';

  constructor(parameters: ParametersConstructorDTO) {
    this.name = 'InvalidCollectionPrivacyStatusError';
    this.message = `The collection privacy status "${parameters.privacyStatus}" is invalid.`;
    this.status = StatusError.INVALID;
  }
}
