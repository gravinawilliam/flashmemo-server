import { ISendLogTimeUseCaseLoggerProvider } from '@contracts/providers/logger/send-log-time-use-case.logger-provider';
import { IFindByIdCollectionCategoriesRepository } from '@contracts/repositories/collection-categories/find-by-id.collection-categories-repository';
import { ISaveCollectionsRepository } from '@contracts/repositories/collections/save.collections-repository';

import { ProviderError } from '@errors/_shared/provider.error';
import { RepositoryError } from '@errors/_shared/repository.error';
import { CollectionCategoryNotFoundError } from '@errors/models/collection-category/collection-category-not-found.error';
import { InvalidCollectionDescriptionError } from '@errors/models/collection/invalid-collection-description.error';
import { InvalidCollectionNameError } from '@errors/models/collection/invalid-collection-name.error';
import { InvalidCollectionPrivacyStatusError } from '@errors/models/collection/invalid-collection-privacy-status.error';

import { Collection, CollectionPrivacyStatus } from '@models/collection.model';
import { User } from '@models/user.model';

import { UseCase } from '@use-cases/_shared/use-case';

import { Either, failure, success } from '@shared/utils/either.util';

export class CreateCollectionUseCase extends UseCase<
  CreateCollectionUseCaseDTO.Parameters,
  CreateCollectionUseCaseDTO.ResultFailure,
  CreateCollectionUseCaseDTO.ResultSuccess
> {
  constructor(
    loggerProvider: ISendLogTimeUseCaseLoggerProvider,
    private readonly collectionCategoriesRepository: IFindByIdCollectionCategoriesRepository,
    private readonly collectionsRepository: ISaveCollectionsRepository
  ) {
    super(loggerProvider);
  }

  protected async performOperation(parameters: CreateCollectionUseCaseDTO.Parameters): CreateCollectionUseCaseDTO.Result {
    const collectionPrivacyStatus = parameters.collection.privacyStatus.trim().toLowerCase();
    if (
      collectionPrivacyStatus !== CollectionPrivacyStatus.PRIVATE &&
      collectionPrivacyStatus !== CollectionPrivacyStatus.PUBLIC
    ) {
      return failure(new InvalidCollectionPrivacyStatusError({ privacyStatus: collectionPrivacyStatus }));
    }

    const collectionDescription = parameters.collection.description.trim();
    if (collectionDescription.length > 300) {
      return failure(new InvalidCollectionDescriptionError({ collection: { description: collectionDescription } }));
    }

    const collectionName = parameters.collection.name.trim();
    if (collectionName.length > 100) {
      return failure(new InvalidCollectionNameError({ collection: { name: collectionName } }));
    }

    const resultFindByIdCollectionCategory = await this.collectionCategoriesRepository.findById({
      collectionCategory: { id: parameters.collection.category.id }
    });
    if (resultFindByIdCollectionCategory.isFailure()) return failure(resultFindByIdCollectionCategory.value);
    const { collectionCategory } = resultFindByIdCollectionCategory.value;
    if (collectionCategory === undefined) {
      return failure(
        new CollectionCategoryNotFoundError({
          collectionCategory: {
            id: parameters.collection.category.id
          }
        })
      );
    }

    const resultSaveCollection = await this.collectionsRepository.save({
      collection: {
        name: collectionName,
        description: collectionDescription,
        privacyStatus: collectionPrivacyStatus,
        category: { id: collectionCategory.id },
        owner: { id: parameters.user.id }
      }
    });
    if (resultSaveCollection.isFailure()) return failure(resultSaveCollection.value);

    return success({ collection: resultSaveCollection.value.collection });
  }
}

export namespace CreateCollectionUseCaseDTO {
  export type Parameters = Readonly<{
    user: Pick<User, 'id'>;
    collection: {
      name: string;
      description: string;
      category: { id: string };
      privacyStatus: string;
    };
  }>;

  export type ResultFailure = Readonly<
    | RepositoryError
    | ProviderError
    | CollectionCategoryNotFoundError
    | InvalidCollectionPrivacyStatusError
    | InvalidCollectionDescriptionError
    | InvalidCollectionNameError
  >;
  export type ResultSuccess = Readonly<{
    collection: Pick<Collection, 'id'>;
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}
