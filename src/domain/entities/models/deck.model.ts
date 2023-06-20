import { Collection } from '@models/collection.model';
import { Flashcard } from '@models/flashcard.model';
import { User } from '@models/user.model';

export type Deck = {
  id: string;
  flashcards: Pick<Flashcard, 'id'>[];
  isAnswered: boolean;
  owner: Pick<User, 'id'>;
  collection: Pick<Collection, 'id'>;
};
