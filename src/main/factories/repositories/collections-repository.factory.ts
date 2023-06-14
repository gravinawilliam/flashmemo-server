import { IFindByIdCollectionsRepository } from '@contracts/repositories/collections/find-by-id.collections-repository';
import { IFindManyByOwnerCollectionsRepository } from '@contracts/repositories/collections/find-many-by-owner.collections-repository';
import { ISaveCollectionsRepository } from '@contracts/repositories/collections/save.collections-repository';

import { prisma } from '@infrastructure/database/prisma/prisma';
import { CollectionsPrismaRepository } from '@infrastructure/database/prisma/repositories/collections.prisma-repository';

import { makeCryptoProvider } from '@factories/providers/crypto-provider.factory';
import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';

export const makeCollectionsRepository = (): IFindByIdCollectionsRepository &
  IFindManyByOwnerCollectionsRepository &
  ISaveCollectionsRepository => new CollectionsPrismaRepository(makeLoggerProvider(), makeCryptoProvider(), prisma);
