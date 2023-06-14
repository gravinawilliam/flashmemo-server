import { StatusError } from '@errors/_shared/status-error';

export class FlashcardWithoutCorrectResponseError {
  readonly status: StatusError;

  readonly message: string;

  readonly name: 'FlashcardWithoutCorrectResponseError';

  constructor() {
    this.name = 'FlashcardWithoutCorrectResponseError';
    this.message = `The flashcard must have at least one correct response.`;
    this.status = StatusError.INVALID;
  }
}
