import { PrismaClient } from '@prisma/client';

import { IGenerateIdCryptoProvider } from '@contracts/providers/crypto/generate-id.crypto-provider';
import { ISendLogErrorLoggerProvider } from '@contracts/providers/logger/send-log-error-logger.provider';
import {
  FindByEmailUsersRepositoryDTO,
  IFindByEmailUsersRepository
} from '@contracts/repositories/users/find-by-email.users-repository';
import { ISaveUsersRepository, SaveUsersRepositoryDTO } from '@contracts/repositories/users/save.users-repository';

import { RepositoryError, RepositoryNames, UsersRepositoryMethods } from '@errors/_shared/repository.error';

import { Email } from '@value-objects/email.value-object';
import { Id } from '@value-objects/id.value-object';
import { Password } from '@value-objects/password.value-object';

import { failure, success } from '@shared/utils/either.util';

export class UsersPrismaRepository implements IFindByEmailUsersRepository, ISaveUsersRepository {
  constructor(
    private readonly loggerProvider: ISendLogErrorLoggerProvider,
    private readonly cryptoProvider: IGenerateIdCryptoProvider,
    private readonly prisma: PrismaClient
  ) {}

  public async findByEmail(parameters: FindByEmailUsersRepositoryDTO.Parameters): FindByEmailUsersRepositoryDTO.Result {
    try {
      const foundUser = await this.prisma.usersTable.findFirst({
        where: { email: parameters.user.email.value },
        select: {
          id: true,
          email: true,
          password: true
        }
      });

      if (foundUser === null) return success({ user: undefined });

      const resultValidateEmail = Email.validate({ email: foundUser.email });
      if (resultValidateEmail.isFailure()) return failure(resultValidateEmail.value);
      const { emailValidated } = resultValidateEmail.value;

      return success({
        user: {
          id: new Id({ id: foundUser.id }),
          email: emailValidated,
          password: new Password({
            isEncrypted: true,
            password: foundUser.password
          })
        }
      });
    } catch (error: any) {
      const repositoryError = new RepositoryError({
        error,
        repository: {
          name: RepositoryNames.USERS,
          method: UsersRepositoryMethods.FIND_BY_EMAIL,
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

  public async save(parameters: SaveUsersRepositoryDTO.Parameters): SaveUsersRepositoryDTO.Result {
    try {
      const resultUuidProvider = this.cryptoProvider.generateId();
      if (resultUuidProvider.isFailure()) return failure(resultUuidProvider.value);
      const { id } = resultUuidProvider.value;

      const created = await this.prisma.usersTable.create({
        data: {
          id: id.value,
          email: parameters.user.email.value,
          password: parameters.user.password.value,
          name: parameters.user.name
        },
        select: {
          id: true
        }
      });

      return success({ user: { id: new Id({ id: created.id }) } });
    } catch (error: any) {
      const repositoryError = new RepositoryError({
        error,
        repository: {
          name: RepositoryNames.USERS,
          method: UsersRepositoryMethods.SAVE,
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
