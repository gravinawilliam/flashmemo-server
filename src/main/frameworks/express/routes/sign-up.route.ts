import { Router } from 'express';

import { makeSignUpController } from '@factories/controllers/users/sign-up-controller.factory';

import { adapterRoute } from '@main/frameworks/express/adapters/express-router.adapter';

const router: Router = Router();

router.post('/', adapterRoute(makeSignUpController()));

export default router;
