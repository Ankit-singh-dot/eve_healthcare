import { Router } from 'express';
import * as bookingController from '../controllers/booking.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { createBookingSchema } from '../schemas/index.js';

const router = Router();

router.use(authenticate);

router.post('/', validate(createBookingSchema), bookingController.createBooking);
router.get('/', bookingController.getBookings);

export default router;
    