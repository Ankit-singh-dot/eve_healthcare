import { Router } from 'express';
import * as paymentController from '../controllers/payment.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { mockPaymentSchema, paymentWebhookSchema } from '../schemas/index.js';

const router = Router();

router.post('/', authenticate, validate(mockPaymentSchema), paymentController.processPayment);
router.post('/webhook', validate(paymentWebhookSchema), paymentController.handleWebhook);

export default router;
