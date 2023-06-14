import { CollectionCategory } from '@models/collection-category.model';
import { User } from '@models/user.model';

export enum CollectionPrivacyStatus {
  PRIVATE = 'private',
  PUBLIC = 'public'
}

export type Collection = {
  id: string;
  name: string;
  description: string;
  privacyStatus: CollectionPrivacyStatus;
  owner: Pick<User, 'id'>;
  category: Pick<CollectionCategory, 'id'>;
};
