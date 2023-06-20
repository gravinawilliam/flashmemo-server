import { UseCase } from '@use-cases/_shared/use-case';
import { AnswerDeckUseCase, AnswerDeckUseCaseDTO } from '@use-cases/decks/answer-deck.use-case';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeDecksRepository } from '@factories/repositories/decks-repository.factory';

export const makeAnswerDeckUseCase = (): UseCase<
  AnswerDeckUseCaseDTO.Parameters,
  AnswerDeckUseCaseDTO.ResultFailure,
  AnswerDeckUseCaseDTO.ResultSuccess
> => new AnswerDeckUseCase(makeLoggerProvider(), makeDecksRepository());
