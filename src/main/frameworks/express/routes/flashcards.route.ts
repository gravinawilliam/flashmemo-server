import { Router } from 'express';

import { makeCreateFlashcardController } from '@factories/controllers/flashcards/create-flashcard-controller.factory';
import { makeListFlashcardsController } from '@factories/controllers/flashcards/list-flashcards-controller.factory';

import { adapterRoute } from '@main/frameworks/express/adapters/express-router.adapter';

const router: Router = Router();

router.post('/create', adapterRoute(makeCreateFlashcardController()));
router.get('/list', adapterRoute(makeListFlashcardsController()));

export default router;
