import { PrismaClient } from '@prisma/client';

import { ISendLogErrorLoggerProvider } from '@contracts/providers/logger/send-log-error-logger.provider';
import {
  FindByIdCollectionCategoriesRepositoryDTO,
  IFindByIdCollectionCategoriesRepository
} from '@contracts/repositories/collection-categories/find-by-id.collection-categories-repository';

import {
  CollectionCategoriesRepositoryMethods,
  RepositoryError,
  RepositoryNames
} from '@errors/_shared/repository.error';

import { failure, success } from '@shared/utils/either.util';

export class CollectionCategoriesPrismaRepository implements IFindByIdCollectionCategoriesRepository {
  constructor(private readonly loggerProvider: ISendLogErrorLoggerProvider, private readonly prisma: PrismaClient) {}

  public async findById(
    parameters: FindByIdCollectionCategoriesRepositoryDTO.Parameters
  ): FindByIdCollectionCategoriesRepositoryDTO.Result {
    try {
      const found = await this.prisma.collectionCategoriesTable.findFirst({
        where: { id: parameters.collectionCategory.id }
      });

      console.log(found);

      if (found === null) return success({ collectionCategory: undefined });

      return success({ collectionCategory: { id: found.id } });
    } catch (error: any) {
      const repositoryError = new RepositoryError({
        error,
        repository: {
          name: RepositoryNames.COLLECTION_CATEGORIES,
          method: CollectionCategoriesRepositoryMethods.FIND_BY_ID,
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
