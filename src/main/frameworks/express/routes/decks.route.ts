import { Router } from 'express';

import { makeAnswerDeckController } from '@factories/controllers/decks/answer-deck-controller.factory';
import { makeBuildDeckController } from '@factories/controllers/decks/build-deck-controller.factory';
import { makeGetDeckController } from '@factories/controllers/decks/get-deck-controller.factory';
import { makeListDecksUnansweredController } from '@factories/controllers/decks/list-decks-unanswered-controller.factory';

import { adapterRoute } from '@main/frameworks/express/adapters/express-router.adapter';

const router: Router = Router();

router.post('/answer', adapterRoute(makeAnswerDeckController()));
router.post('/build', adapterRoute(makeBuildDeckController()));
router.get('/find', adapterRoute(makeGetDeckController()));
router.get('/list', adapterRoute(makeListDecksUnansweredController()));

export default router;
