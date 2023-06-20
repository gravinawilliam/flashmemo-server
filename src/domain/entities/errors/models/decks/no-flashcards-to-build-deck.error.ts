import { StatusError } from '@errors/_shared/status-error';

export class NoFlashcardsToBuildDeckError {
  readonly status: StatusError;

  readonly message: string;

  readonly name: 'NoFlashcardsToBuildDeckError';

  constructor() {
    this.name = 'NoFlashcardsToBuildDeckError';
    this.message = `No flashcards to build deck`;
    this.status = StatusError.INVALID;
  }
}
