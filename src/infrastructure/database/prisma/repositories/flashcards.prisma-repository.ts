import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

import { IGenerateIdCryptoProvider } from '@contracts/providers/crypto/generate-id.crypto-provider';
import { ISendLogErrorLoggerProvider } from '@contracts/providers/logger/send-log-error-logger.provider';
import {
  FindAnsweredFlashcardsRepositoryDTO,
  IFindAnsweredFlashcardsRepository
} from '@contracts/repositories/flashcards/find-answered.flashcards-repository';
import {
  FindByCollectionFlashcardsRepositoryDTO,
  IFindByCollectionFlashcardsRepository
} from '@contracts/repositories/flashcards/find-many-by-collection.flashcards-repository';
import {
  FindUnansweredFlashcardsRepositoryDTO,
  IFindUnansweredFlashcardsRepository
} from '@contracts/repositories/flashcards/find-unanswered.flashcards-repository';
import {
  ISaveFlashcardsRepository,
  SaveFlashcardsRepositoryDTO
} from '@contracts/repositories/flashcards/save.flashcards-repository';

import { FlashcardsRepositoryMethods, RepositoryError, RepositoryNames } from '@errors/_shared/repository.error';

import { failure, success } from '@shared/utils/either.util';

export class FlashcardsPrismaRepository
  implements
    IFindByCollectionFlashcardsRepository,
    ISaveFlashcardsRepository,
    IFindAnsweredFlashcardsRepository,
    IFindUnansweredFlashcardsRepository
{
  constructor(
    private readonly loggerProvider: ISendLogErrorLoggerProvider,
    private readonly cryptoProvider: IGenerateIdCryptoProvider,
    private readonly prisma: PrismaClient
  ) {}

  public async findAnswered(
    parameters: FindAnsweredFlashcardsRepositoryDTO.Parameters
  ): FindAnsweredFlashcardsRepositoryDTO.Result {
    try {
      const found = await this.prisma.flashcardsTable.findMany({
        where: { collectionId: parameters.flashcard.collection.id, isAnswered: true },
        take: parameters.maxFlashcards
      });

      return success({ flashcardsAnswered: found.map(flashcard => ({ id: flashcard.id })) });
    } catch (error: any) {
      const repositoryError = new RepositoryError({
        error,
        repository: {
          name: RepositoryNames.COLLECTIONS,
          method: FlashcardsRepositoryMethods.FIND_MANY_BY_COLLECTION,
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

  public async findUnanswered(
    parameters: FindUnansweredFlashcardsRepositoryDTO.Parameters
  ): FindUnansweredFlashcardsRepositoryDTO.Result {
    try {
      const found = await this.prisma.flashcardsTable.findMany({
        where: { collectionId: parameters.flashcard.collection.id, isAnswered: false },
        take: parameters.maxFlashcards
      });

      return success({ flashcardsUnanswered: found.map(flashcard => ({ id: flashcard.id })) });
    } catch (error: any) {
      const repositoryError = new RepositoryError({
        error,
        repository: {
          name: RepositoryNames.COLLECTIONS,
          method: FlashcardsRepositoryMethods.FIND_MANY_BY_COLLECTION,
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

  public async findManyByCollection(
    parameters: FindByCollectionFlashcardsRepositoryDTO.Parameters
  ): FindByCollectionFlashcardsRepositoryDTO.Result {
    try {
      const found = await this.prisma.flashcardsTable.findMany({
        where: { collectionId: parameters.flashcard.collection.id },
        include: {
          FlashcardResponsesTable: true
        }
      });

      const flashcards = found.map(flashcard => {
        return {
          id: flashcard.id,
          collection: { id: flashcard.collectionId },
          front: flashcard.front,
          responses: flashcard.FlashcardResponsesTable.map(response => ({
            text: response.text
          }))
        };
      });

      return success({ flashcards });
    } catch (error: any) {
      const repositoryError = new RepositoryError({
        error,
        repository: {
          name: RepositoryNames.COLLECTIONS,
          method: FlashcardsRepositoryMethods.FIND_MANY_BY_COLLECTION,
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

  public async save(parameters: SaveFlashcardsRepositoryDTO.Parameters): SaveFlashcardsRepositoryDTO.Result {
    try {
      const resultUuidProvider = this.cryptoProvider.generateId();
      if (resultUuidProvider.isFailure()) return failure(resultUuidProvider.value);
      const { id } = resultUuidProvider.value;

      const created = await this.prisma.flashcardsTable.create({
        data: {
          id,
          front: parameters.flashcard.front,
          collectionId: parameters.flashcard.collection.id,
          ownerId: parameters.flashcard.owner.id,
          isAnswered: false
        },
        select: {
          id: true
        }
      });
      await this.prisma.flashcardResponsesTable.createMany({
        data: parameters.flashcard.responses.map(response => {
          let idCreated: string = crypto.randomUUID();
          const resultId = this.cryptoProvider.generateId();
          if (resultId.isSuccess()) idCreated = resultId.value.id;
          return {
            flashcardId: created.id,
            text: response.text,
            isCorrect: response.isCorrect,
            id: idCreated
          };
        })
      });

      return success({ flashcard: { id: created.id } });
    } catch (error: any) {
      const repositoryError = new RepositoryError({
        error,
        repository: {
          name: RepositoryNames.COLLECTIONS,
          method: FlashcardsRepositoryMethods.SAVE,
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
