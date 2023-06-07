import { Email } from '@value-objects/email.value-object';
import { Id } from '@value-objects/id.value-object';
import { Password } from '@value-objects/password.value-object';

export type User = {
  id: Id;
  name: string;
  email: Email;
  password: Password;
};
