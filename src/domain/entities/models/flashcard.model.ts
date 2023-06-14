import { Collection } from '@models/collection.model';
import { User } from '@models/user.model';

export type FlashcardResponse = {
  text: string;
  isCorrect: boolean;
};

export type Flashcard = {
  id: string;
  front: string;
  responses: FlashcardResponse[];
  owner: Pick<User, 'id'>;
  collection: Pick<Collection, 'id'>;
};
