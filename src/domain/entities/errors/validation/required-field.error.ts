import { StatusError } from '@errors/_shared/status-error';

type ParametersConstructorDTO = { fieldName: string };

export class RequiredFieldError {
  readonly status: StatusError;

  readonly message: string;

  readonly name: 'RequiredFieldError';

  constructor(parameters: ParametersConstructorDTO) {
    this.name = 'RequiredFieldError';
    this.message = `This field is required: ${parameters.fieldName}.`;
    this.status = StatusError.REQUIRED;
  }
}
