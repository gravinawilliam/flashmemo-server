import { ISendLogTimeUseCaseLoggerProvider } from '@contracts/providers/logger/send-log-time-use-case.logger-provider';
import { IFindAllUnansweredDecksRepository } from '@contracts/repositories/decks/find-all-unanswered.decks-repository';

import { ProviderError } from '@errors/_shared/provider.error';
import { RepositoryError } from '@errors/_shared/repository.error';
import { DeckNotFoundError } from '@errors/models/decks/deck-not-found.error';

import { User } from '@models/user.model';

import { UseCase } from '@use-cases/_shared/use-case';

import { Either, failure, success } from '@shared/utils/either.util';

export class ListDecksUnansweredUseCase extends UseCase<
  ListDecksUnansweredUseCaseDTO.Parameters,
  ListDecksUnansweredUseCaseDTO.ResultFailure,
  ListDecksUnansweredUseCaseDTO.ResultSuccess
> {
  constructor(
    loggerProvider: ISendLogTimeUseCaseLoggerProvider,
    private readonly decksRepository: IFindAllUnansweredDecksRepository
  ) {
    super(loggerProvider);
  }

  protected async performOperation(
    parameters: ListDecksUnansweredUseCaseDTO.Parameters
  ): ListDecksUnansweredUseCaseDTO.Result {
    const resultFindDeck = await this.decksRepository.findAllUnanswered({
      deck: {
        owner: { id: parameters.user.id }
      }
    });
    if (resultFindDeck.isFailure()) return failure(resultFindDeck.value);
    const { decksUnanswered } = resultFindDeck.value;

    return success({ decksUnanswered });
  }
}

export namespace ListDecksUnansweredUseCaseDTO {
  export type Parameters = Readonly<{
    user: Pick<User, 'id'>;
  }>;

  export type ResultFailure = Readonly<RepositoryError | ProviderError | DeckNotFoundError>;
  export type ResultSuccess = Readonly<{
    decksUnanswered: {
      id: string;
      collection: {
        id: string;
        name: string;
      };
    }[];
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}
