import { Email } from '@value-objects/email.value-object';
import { Password } from '@value-objects/password.value-object';

export type User = {
  id: string;
  name: string;
  email: Email;
  password: Password;
};
