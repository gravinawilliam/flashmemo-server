import { UseCase } from '@use-cases/_shared/use-case';
import {
  ListDecksUnansweredUseCase,
  ListDecksUnansweredUseCaseDTO
} from '@use-cases/decks/list-decks-unanswered.use-case';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeDecksRepository } from '@factories/repositories/decks-repository.factory';

export const makeListDecksUnansweredUseCase = (): UseCase<
  ListDecksUnansweredUseCaseDTO.Parameters,
  ListDecksUnansweredUseCaseDTO.ResultFailure,
  ListDecksUnansweredUseCaseDTO.ResultSuccess
> => new ListDecksUnansweredUseCase(makeLoggerProvider(), makeDecksRepository());
