import { IFindByIdCollectionCategoriesRepository } from '@contracts/repositories/collection-categories/find-by-id.collection-categories-repository';

import { prisma } from '@infrastructure/database/prisma/prisma';
import { CollectionCategoriesPrismaRepository } from '@infrastructure/database/prisma/repositories/collection-categories.prisma-repository';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';

export const makeCollectionCategoriesRepository = (): IFindByIdCollectionCategoriesRepository =>
  new CollectionCategoriesPrismaRepository(makeLoggerProvider(), prisma);
