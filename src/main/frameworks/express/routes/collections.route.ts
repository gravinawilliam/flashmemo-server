import { Router } from 'express';

import { makeCreateCollectionController } from '@factories/controllers/collections/create-collection-controller.factory';
import { makeListCollectionsController } from '@factories/controllers/collections/list-collections-controller.factory';

import { adapterRoute } from '@main/frameworks/express/adapters/express-router.adapter';

const router: Router = Router();

router.post('/create', adapterRoute(makeCreateCollectionController()));
router.get('/list', adapterRoute(makeListCollectionsController()));

export default router;
