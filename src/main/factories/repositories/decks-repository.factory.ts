import { IFindAllUnansweredDecksRepository } from '@contracts/repositories/decks/find-all-unanswered.decks-repository';
import { IFindDeckAndResponsesDecksRepository } from '@contracts/repositories/decks/find-deck-and-responses.decks-repository';
import { IFindUnansweredDecksRepository } from '@contracts/repositories/decks/find-unanswered.decks-repository';
import { IFindDecksRepository } from '@contracts/repositories/decks/find.decks-repository';
import { ISaveDecksRepository } from '@contracts/repositories/decks/save.decks-repository';
import { IUpdateDecksRepository } from '@contracts/repositories/decks/update.decks-repository';

import { prisma } from '@infrastructure/database/prisma/prisma';
import { DecksPrismaRepository } from '@infrastructure/database/prisma/repositories/decks.prisma-repository';

import { makeCryptoProvider } from '@factories/providers/crypto-provider.factory';
import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';

export const makeDecksRepository = (): IFindAllUnansweredDecksRepository &
  IFindDeckAndResponsesDecksRepository &
  IFindUnansweredDecksRepository &
  IFindDecksRepository &
  ISaveDecksRepository &
  IUpdateDecksRepository => new DecksPrismaRepository(makeLoggerProvider(), makeCryptoProvider(), prisma);
