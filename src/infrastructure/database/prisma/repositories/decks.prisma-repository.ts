import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

import { IGenerateIdCryptoProvider } from '@contracts/providers/crypto/generate-id.crypto-provider';
import { ISendLogErrorLoggerProvider } from '@contracts/providers/logger/send-log-error-logger.provider';
import {
  FindAllUnansweredDecksRepositoryDTO,
  IFindAllUnansweredDecksRepository
} from '@contracts/repositories/decks/find-all-unanswered.decks-repository';
import {
  FindDeckAndResponsesDecksRepositoryDTO,
  IFindDeckAndResponsesDecksRepository
} from '@contracts/repositories/decks/find-deck-and-responses.decks-repository';
import {
  FindUnansweredDecksRepositoryDTO,
  IFindUnansweredDecksRepository
} from '@contracts/repositories/decks/find-unanswered.decks-repository';
import { FindDecksRepositoryDTO, IFindDecksRepository } from '@contracts/repositories/decks/find.decks-repository';
import { ISaveDecksRepository, SaveDecksRepositoryDTO } from '@contracts/repositories/decks/save.decks-repository';
import { IUpdateDecksRepository, UpdateDecksRepositoryDTO } from '@contracts/repositories/decks/update.decks-repository';

import { DecksRepositoryMethods, RepositoryError, RepositoryNames } from '@errors/_shared/repository.error';

import { Deck } from '@models/deck.model';

import { failure, success } from '@shared/utils/either.util';

export class DecksPrismaRepository
  implements
    IFindAllUnansweredDecksRepository,
    IFindDeckAndResponsesDecksRepository,
    IFindUnansweredDecksRepository,
    IFindDecksRepository,
    ISaveDecksRepository,
    IUpdateDecksRepository
{
  constructor(
    private readonly loggerProvider: ISendLogErrorLoggerProvider,
    private readonly cryptoProvider: IGenerateIdCryptoProvider,
    private readonly prisma: PrismaClient
  ) {}

  public async findAllUnanswered(
    parameters: FindAllUnansweredDecksRepositoryDTO.Parameters
  ): FindAllUnansweredDecksRepositoryDTO.Result {
    try {
      const found = await this.prisma.decksTable.findMany({
        where: { ownerId: parameters.deck.owner.id, isAnswered: false },
        include: {
          collection: {
            select: {
              name: true
            }
          }
        }
      });
      const decks: FindAllUnansweredDecksRepositoryDTO.DeckUnansweredType[] = found.map(deck => ({
        collection: {
          id: deck.collectionId,
          name: deck.collection.name
        },
        id: deck.id
      }));

      return success({ decksUnanswered: decks });
    } catch (error: any) {
      const repositoryError = new RepositoryError({
        error,
        repository: {
          name: RepositoryNames.DECKS,
          method: DecksRepositoryMethods.FIND_ALL_UNANSWERED,
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

  public async findDeckAndResponses(
    parameters: FindDeckAndResponsesDecksRepositoryDTO.Parameters
  ): FindDeckAndResponsesDecksRepositoryDTO.Result {
    try {
      const found = await this.prisma.decksTable.findFirst({
        where: { ownerId: parameters.deck.owner.id, id: parameters.deck.id },
        include: {
          deckFlashcards: {
            include: {
              flashcard: {
                include: {
                  FlashcardResponsesTable: true
                }
              }
            }
          }
        }
      });
      if (found === null) return success({ deck: undefined });

      const deck: FindDeckAndResponsesDecksRepositoryDTO.DeckType = {
        collection: {
          id: found.collectionId
        },
        id: found.id,
        flashcards: found.deckFlashcards.map(deckFlashcard => ({
          front: deckFlashcard.flashcard.front,
          id: deckFlashcard.flashcard.id,
          responses: deckFlashcard.flashcard.FlashcardResponsesTable.map(flashcardResponse => ({
            isCorrect: flashcardResponse.isCorrect,
            id: flashcardResponse.id,
            text: flashcardResponse.text
          }))
        }))
      };

      return success({ deck });
    } catch (error: any) {
      const repositoryError = new RepositoryError({
        error,
        repository: {
          name: RepositoryNames.DECKS,
          method: DecksRepositoryMethods.FIND_DECK_AND_RESPONSES,
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
    parameters: FindUnansweredDecksRepositoryDTO.Parameters
  ): FindUnansweredDecksRepositoryDTO.Result {
    try {
      const found = await this.prisma.decksTable.findFirst({
        where: { ownerId: parameters.deck.owner.id, isAnswered: false, collectionId: parameters.deck.collection.id },
        include: {
          deckFlashcards: true
        }
      });
      if (found === null) return success({ deckUnanswered: undefined });

      const deckUnanswered: Pick<Deck, 'id' | 'flashcards'> = {
        flashcards: found.deckFlashcards.map(deckFlashcard => ({
          id: deckFlashcard.flashcardId
        })),
        id: found.id
      };

      return success({ deckUnanswered });
    } catch (error: any) {
      const repositoryError = new RepositoryError({
        error,
        repository: {
          name: RepositoryNames.DECKS,
          method: DecksRepositoryMethods.FIND_UNANSWERED,
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

  public async find(parameters: FindDecksRepositoryDTO.Parameters): FindDecksRepositoryDTO.Result {
    try {
      const found = await this.prisma.decksTable.findFirst({
        where: { ownerId: parameters.deck.owner.id, id: parameters.deck.id },
        include: {
          deckFlashcards: {
            include: {
              flashcard: {
                include: {
                  FlashcardResponsesTable: true
                }
              }
            }
          }
        }
      });
      if (found === null) return success({ deck: undefined });

      const deck: FindDecksRepositoryDTO.DeckType = {
        collection: {
          id: found.collectionId
        },
        id: found.id,
        flashcards: found.deckFlashcards.map(deckFlashcard => {
          const response = deckFlashcard.flashcard.FlashcardResponsesTable.find(
            flashcardResponse => flashcardResponse.isCorrect
          );

          return {
            front: deckFlashcard.flashcard.front,
            id: deckFlashcard.flashcard.id,
            flashcardDeckId: deckFlashcard.id,
            response: {
              id: response!.id,
              text: response!.text,
              isCorrect: response!.isCorrect
            }
          };
        })
      };

      return success({ deck });
    } catch (error: any) {
      const repositoryError = new RepositoryError({
        error,
        repository: {
          name: RepositoryNames.DECKS,
          method: DecksRepositoryMethods.FIND,
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

  public async save(parameters: SaveDecksRepositoryDTO.Parameters): SaveDecksRepositoryDTO.Result {
    try {
      const resultUuidProvider = this.cryptoProvider.generateId();
      if (resultUuidProvider.isFailure()) return failure(resultUuidProvider.value);
      const { id } = resultUuidProvider.value;

      const created = await this.prisma.decksTable.create({
        data: {
          id,
          isAnswered: false,
          ownerId: parameters.deck.owner.id,
          collectionId: parameters.deck.collection.id
        },
        select: {
          id: true
        }
      });

      const flashcards: { id: string }[] = [];

      for await (const flashcard of parameters.deck.flashcards) {
        const uuid = crypto.randomUUID();
        flashcards.push({ id: flashcard.id });
        console.log(flashcard.id);
        await this.prisma.deckFlashcardsTable.create({
          data: {
            id: uuid,
            flashcardId: flashcard.id,
            deckId: created.id,
            isWinner: null,
            ownerId: parameters.deck.owner.id
          }
        });
      }

      return success({ deckSaved: { id: created.id, flashcards } });
    } catch (error: any) {
      const repositoryError = new RepositoryError({
        error,
        repository: {
          name: RepositoryNames.DECKS,
          method: DecksRepositoryMethods.SAVE,
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

  public async update(parameters: UpdateDecksRepositoryDTO.Parameters): UpdateDecksRepositoryDTO.Result {
    try {
      await this.prisma.decksTable.update({
        where: { id: parameters.deck.id },
        data: {
          isAnswered: parameters.deck.isAnswered
        }
      });
      for await (const flashcard of parameters.deck.flashcards) {
        await this.prisma.flashcardsTable.update({
          where: { id: flashcard.id },
          data: {
            isAnswered: true
          }
        });
        await this.prisma.deckFlashcardsTable.update({
          where: { id: flashcard.flashcardDeckId },
          data: {
            isWinner: flashcard.isWinner
          }
        });
      }
      return success(undefined);
    } catch (error: any) {
      const repositoryError = new RepositoryError({
        error,
        repository: {
          name: RepositoryNames.DECKS,
          method: DecksRepositoryMethods.UPDATE,
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
