import { IFindByEmailUsersRepository } from '@contracts/repositories/users/find-by-email.users-repository';
import { ISaveUsersRepository } from '@contracts/repositories/users/save.users-repository';

import { prisma } from '@infrastructure/database/prisma/prisma';
import { UsersPrismaRepository } from '@infrastructure/database/prisma/repositories/users.prisma-repository';

import { makeCryptoProvider } from '@factories/providers/crypto-provider.factory';
import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';

export const makeUsersRepository = (): IFindByEmailUsersRepository & ISaveUsersRepository =>
  new UsersPrismaRepository(makeLoggerProvider(), makeCryptoProvider(), prisma);
