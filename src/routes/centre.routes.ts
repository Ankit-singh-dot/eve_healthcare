import { Router } from 'express';
import * as centreController from '../controllers/centre.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { createCentreSchema, createTestSchema, addTestToCentreSchema } from '../schemas/index.js';

const router = Router();

// In a real app, these would probably be protected by an admin role
router.post('/centres', authenticate, validate(createCentreSchema), centreController.createCentre);
router.get('/centres', centreController.getCentres);

router.post('/tests', authenticate, validate(createTestSchema), centreController.createTest);
router.get('/tests', centreController.getTests);

router.post('/centres/:centreId/tests', authenticate, validate(addTestToCentreSchema), centreController.addTestToCentre);

export default router;
