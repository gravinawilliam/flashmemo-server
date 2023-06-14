import { Controller, ResponseSuccess, StatusSuccess } from '@application/controllers/_shared/controller';

import { ISendLogErrorLoggerProvider } from '@contracts/providers/logger/send-log-error-logger.provider';
import { ISendLogTimeControllerLoggerProvider } from '@contracts/providers/logger/send-log-time-controller.logger-provider';

import { Collection } from '@models/collection.model';

import { UseCase } from '@use-cases/_shared/use-case';
import { CreateCollectionUseCaseDTO } from '@use-cases/collections/create-collection.use-case';
import { VerifyAccessTokenUseCaseDTO } from '@use-cases/users/verify-access-token.use-case';

import { HttpRequest } from '@shared/types/http-request.type';
import { Either, failure, success } from '@shared/utils/either.util';

export class CreateCollectionController extends Controller<
  CreateCollectionControllerDTO.Parameters,
  CreateCollectionControllerDTO.Result
> {
  constructor(
    loggerProvider: ISendLogErrorLoggerProvider & ISendLogTimeControllerLoggerProvider,
    private readonly verifyAccessTokenUseCase: UseCase<
      VerifyAccessTokenUseCaseDTO.Parameters,
      VerifyAccessTokenUseCaseDTO.ResultFailure,
      VerifyAccessTokenUseCaseDTO.ResultSuccess
    >,
    private readonly createCollectionUseCase: UseCase<
      CreateCollectionUseCaseDTO.Parameters,
      CreateCollectionUseCaseDTO.ResultFailure,
      CreateCollectionUseCaseDTO.ResultSuccess
    >
  ) {
    super(loggerProvider);
  }

  protected async performOperation(
    parameters: CreateCollectionControllerDTO.Parameters
  ): CreateCollectionControllerDTO.Result {
    const resultVerifyAccessToken = await this.verifyAccessTokenUseCase.execute({
      accessToken: parameters.access_token
    });
    if (resultVerifyAccessToken.isFailure()) return failure(resultVerifyAccessToken.value);
    const { user } = resultVerifyAccessToken.value;

    const resultCreateCollection = await this.createCollectionUseCase.execute({
      collection: {
        category: parameters.body.collection.category,
        description: parameters.body.collection.description,
        name: parameters.body.collection.name,
        privacyStatus: parameters.body.collection.privacyStatus
      },
      user
    });
    if (resultCreateCollection.isFailure()) return failure(resultCreateCollection.value);

    return success({
      status: StatusSuccess.CREATED,
      data: {
        collection: resultCreateCollection.value.collection
      }
    });
  }
}

export namespace CreateCollectionControllerDTO {
  export type Parameters = Readonly<
    HttpRequest<
      {
        collection: {
          name: string;
          description: string;
          category: { id: string };
          privacyStatus: string;
        };
      },
      undefined
    >
  >;

  type ResultError = Readonly<VerifyAccessTokenUseCaseDTO.ResultFailure | CreateCollectionUseCaseDTO.ResultFailure>;
  type ResultSuccess = Readonly<
    ResponseSuccess<{
      collection: Pick<Collection, 'id'>;
    }>
  >;

  export type Result = Promise<Either<ResultError, ResultSuccess>>;
}
