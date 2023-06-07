import { Router } from 'express';

import healthCheck from './health-check.route';
import signIn from './sign-in.route';
import signUp from './sign-up.route';

const routes: Router = Router();

routes.use('/health-check', healthCheck);
routes.use('/sign-up', signUp);
routes.use('/sign-in', signIn);

export default routes;
