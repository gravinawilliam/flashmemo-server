import { PrismaClient } from '@prisma/client';

import { IGenerateIdCryptoProvider } from '@contracts/providers/crypto/generate-id.crypto-provider';
import { ISendLogErrorLoggerProvider } from '@contracts/providers/logger/send-log-error-logger.provider';
import {
  FindByIdCollectionsRepositoryDTO,
  IFindByIdCollectionsRepository
} from '@contracts/repositories/collections/find-by-id.collections-repository';
import {
  FindManyByOwnerCollectionsRepositoryDTO,
  IFindManyByOwnerCollectionsRepository
} from '@contracts/repositories/collections/find-many-by-owner.collections-repository';
import {
  ISaveCollectionsRepository,
  SaveCollectionsRepositoryDTO
} from '@contracts/repositories/collections/save.collections-repository';

import { CollectionsRepositoryMethods, RepositoryError, RepositoryNames } from '@errors/_shared/repository.error';

import { CollectionPrivacyStatus } from '@models/collection.model';

import { failure, success } from '@shared/utils/either.util';

export class CollectionsPrismaRepository
  implements IFindByIdCollectionsRepository, IFindManyByOwnerCollectionsRepository, ISaveCollectionsRepository
{
  constructor(
    private readonly loggerProvider: ISendLogErrorLoggerProvider,
    private readonly cryptoProvider: IGenerateIdCryptoProvider,
    private readonly prisma: PrismaClient
  ) {}

  public async findById(
    parameters: FindByIdCollectionsRepositoryDTO.Parameters
  ): FindByIdCollectionsRepositoryDTO.Result {
    try {
      const found = await this.prisma.collectionsTable.findFirst({
        where: { id: parameters.collection.id, ownerId: parameters.collection.owner.id }
      });

      if (found === null) return success({ collection: undefined });

      return success({
        collection: {
          id: found.id,
          owner: { id: found.ownerId }
        }
      });
    } catch (error: any) {
      const repositoryError = new RepositoryError({
        error,
        repository: {
          name: RepositoryNames.COLLECTIONS,
          method: CollectionsRepositoryMethods.FIND_BY_ID,
          externalName: 'prisma'
        }
      });
      this.loggerProvider.sendLogError({
        message: repositoryError.message,
        value: error
      });

      return failure(repositoryError);
    }
  }

  public async findManyByOwner(
    parameters: FindManyByOwnerCollectionsRepositoryDTO.Parameters
  ): FindManyByOwnerCollectionsRepositoryDTO.Result {
    try {
      const found = await this.prisma.collectionsTable.findMany({
        where: { ownerId: parameters.collection.owner.id }
      });

      const collections: FindManyByOwnerCollectionsRepositoryDTO.Collections[] = found.map(collection => ({
        category: { id: collection.categoryId, name: collection.name },
        id: collection.id,
        description: collection.description,
        name: collection.name,
        owner: { id: collection.ownerId },
        privacyStatus:
          collection.privacyStatus === 'public' ? CollectionPrivacyStatus.PUBLIC : CollectionPrivacyStatus.PRIVATE
      }));

      return success({ collections });
    } catch (error: any) {
      const repositoryError = new RepositoryError({
        error,
        repository: {
          name: RepositoryNames.COLLECTIONS,
          method: CollectionsRepositoryMethods.FIND_MANY_BY_OWNER,
          externalName: 'prisma'
        }
      });
      this.loggerProvider.sendLogError({
        message: repositoryError.message,
        value: error
      });

      return failure(repositoryError);
    }
  }

  public async save(parameters: SaveCollectionsRepositoryDTO.Parameters): SaveCollectionsRepositoryDTO.Result {
    try {
      const resultUuidProvider = this.cryptoProvider.generateId();
      if (resultUuidProvider.isFailure()) return failure(resultUuidProvider.value);
      const { id } = resultUuidProvider.value;

      const created = await this.prisma.collectionsTable.create({
        data: {
          id,
          description: parameters.collection.description,
          name: parameters.collection.name,
          privacyStatus: parameters.collection.privacyStatus,
          categoryId: parameters.collection.category.id,
          ownerId: parameters.collection.owner.id
        },
        select: {
          id: true
        }
      });

      return success({ collection: { id: created.id } });
    } catch (error: any) {
      const repositoryError = new RepositoryError({
        error,
        repository: {
          name: RepositoryNames.COLLECTIONS,
          method: CollectionsRepositoryMethods.SAVE,
          externalName: 'prisma'
        }
      });
      this.loggerProvider.sendLogError({
        message: repositoryError.message,
        value: error
      });

      return failure(repositoryError);
    }
  }
}
