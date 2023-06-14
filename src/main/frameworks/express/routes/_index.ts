import { Router } from 'express';

import collections from './collections.route';
import flashcards from './flashcards.route';
import healthCheck from './health-check.route';
import signIn from './sign-in.route';
import signUp from './sign-up.route';

const routes: Router = Router();

routes.use('/health-check', healthCheck);
routes.use('/sign-up', signUp);
routes.use('/sign-in', signIn);
routes.use('/collections', collections);
routes.use('/flashcards', flashcards);

export default routes;
