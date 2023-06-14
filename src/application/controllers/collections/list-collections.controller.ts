import { Controller, ResponseSuccess, StatusSuccess } from '@application/controllers/_shared/controller';

import { ISendLogErrorLoggerProvider } from '@contracts/providers/logger/send-log-error-logger.provider';
import { ISendLogTimeControllerLoggerProvider } from '@contracts/providers/logger/send-log-time-controller.logger-provider';

import { CollectionCategory } from '@models/collection-category.model';
import { Collection } from '@models/collection.model';

import { UseCase } from '@use-cases/_shared/use-case';
import { ListCollectionsUseCaseDTO } from '@use-cases/collections/list-collections.use-case';
import { VerifyAccessTokenUseCaseDTO } from '@use-cases/users/verify-access-token.use-case';

import { HttpRequest } from '@shared/types/http-request.type';
import { Either, failure, success } from '@shared/utils/either.util';

export class ListCollectionsController extends Controller<
  ListCollectionsControllerDTO.Parameters,
  ListCollectionsControllerDTO.Result
> {
  constructor(
    loggerProvider: ISendLogErrorLoggerProvider & ISendLogTimeControllerLoggerProvider,
    private readonly verifyAccessTokenUseCase: UseCase<
      VerifyAccessTokenUseCaseDTO.Parameters,
      VerifyAccessTokenUseCaseDTO.ResultFailure,
      VerifyAccessTokenUseCaseDTO.ResultSuccess
    >,
    private readonly listCollectionsUseCase: UseCase<
      ListCollectionsUseCaseDTO.Parameters,
      ListCollectionsUseCaseDTO.ResultFailure,
      ListCollectionsUseCaseDTO.ResultSuccess
    >
  ) {
    super(loggerProvider);
  }

  protected async performOperation(
    parameters: ListCollectionsControllerDTO.Parameters
  ): ListCollectionsControllerDTO.Result {
    const resultVerifyAccessToken = await this.verifyAccessTokenUseCase.execute({
      accessToken: parameters.access_token
    });
    if (resultVerifyAccessToken.isFailure()) return failure(resultVerifyAccessToken.value);
    const { user } = resultVerifyAccessToken.value;

    const resultListCollections = await this.listCollectionsUseCase.execute({
      user
    });
    if (resultListCollections.isFailure()) return failure(resultListCollections.value);

    return success({
      status: StatusSuccess.DONE,
      data: {
        collections: resultListCollections.value.collections
      }
    });
  }
}

export namespace ListCollectionsControllerDTO {
  export type Parameters = Readonly<HttpRequest<undefined, undefined>>;

  type ResultError = Readonly<VerifyAccessTokenUseCaseDTO.ResultFailure | ListCollectionsUseCaseDTO.ResultFailure>;
  type Collections = Pick<Collection, 'id' | 'name' | 'privacyStatus' | 'description'> & {
    category: Pick<CollectionCategory, 'id' | 'name'>;
  };
  type ResultSuccess = Readonly<
    ResponseSuccess<{
      collections: Collections[];
    }>
  >;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}
