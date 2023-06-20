import { StatusError } from '@errors/_shared/status-error';

type ParametersConstructorDTO = {
  deck: { id: string };
};

export class DeckNotFoundError {
  readonly status: StatusError;

  readonly message: string;

  readonly name: 'DeckNotFoundError';

  constructor(parameters: ParametersConstructorDTO) {
    this.name = 'DeckNotFoundError';
    this.message = `The deck with id "${parameters.deck.id}" was not found.`;
    this.status = StatusError.NOT_FOUND;
  }
}
