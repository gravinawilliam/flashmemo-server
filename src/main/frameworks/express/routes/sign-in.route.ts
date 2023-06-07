import { Router } from 'express';

import { makeSignInController } from '@factories/controllers/sign-in/sign-up-controller.factory';

import { adapterRoute } from '@main/frameworks/express/adapters/express-router.adapter';

const router: Router = Router();

router.post('/', adapterRoute(makeSignInController()));

export default router;
