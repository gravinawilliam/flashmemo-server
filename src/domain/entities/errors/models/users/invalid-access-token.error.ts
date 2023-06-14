import { StatusError } from '@errors/_shared/status-error';

export class InvalidAccessTokenError {
  readonly status: StatusError;

  readonly message: string;

  readonly name: 'InvalidAccessTokenError';

  constructor() {
    this.message = `Invalid access token.`;
    this.name = 'InvalidAccessTokenError';
    this.status = StatusError.UNAUTHORIZED;
  }
}
