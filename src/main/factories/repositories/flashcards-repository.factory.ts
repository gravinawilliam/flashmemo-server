import { IFindByCollectionFlashcardsRepository } from '@contracts/repositories/flashcards/find-many-by-collection.flashcards-repository';
import { ISaveFlashcardsRepository } from '@contracts/repositories/flashcards/save.flashcards-repository';

import { prisma } from '@infrastructure/database/prisma/prisma';
import { FlashcardsPrismaRepository } from '@infrastructure/database/prisma/repositories/flashcards.prisma-repository';

import { makeCryptoProvider } from '@factories/providers/crypto-provider.factory';
import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';

export const makeFlashcardsRepository = (): ISaveFlashcardsRepository & IFindByCollectionFlashcardsRepository =>
  new FlashcardsPrismaRepository(makeLoggerProvider(), makeCryptoProvider(), prisma);
