import { StatusError } from '@errors/_shared/status-error';

export class InvalidFlashcardFrontError {
  readonly status: StatusError;

  readonly message: string;

  readonly name: 'InvalidFlashcardFrontError';

  constructor() {
    this.name = 'InvalidFlashcardFrontError';
    this.message = `The flashcard front must have between 5 and 300 characters.`;
    this.status = StatusError.INVALID;
  }
}
