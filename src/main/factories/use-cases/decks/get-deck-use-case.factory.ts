import { UseCase } from '@use-cases/_shared/use-case';
import { GetDeckUseCase, GetDeckUseCaseDTO } from '@use-cases/decks/get-deck.use-case';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeDecksRepository } from '@factories/repositories/decks-repository.factory';

export const makeGetDeckUseCase = (): UseCase<
  GetDeckUseCaseDTO.Parameters,
  GetDeckUseCaseDTO.ResultFailure,
  GetDeckUseCaseDTO.ResultSuccess
> => new GetDeckUseCase(makeLoggerProvider(), makeDecksRepository());
