import { Request, Response } from 'express';
import * as paymentService from '../services/payment.service.js';
import logger from '../config/logger.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';

export const processPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { bookingId, amount } = req.body;
    const result = await paymentService.processPayment(req.user.id, bookingId, amount);
    res.status(200).json(result);
  } catch (error: any) {
    logger.error('Error processing payment', error);
    if (['Booking not found', 'Unauthorized access to booking', 'Booking is not in PENDING state', 'Incorrect payment amount'].includes(error.message)) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const { paymentId, bookingId, status } = req.body;
    const result = await paymentService.handleWebhook(paymentId, bookingId, status);
    res.status(200).json(result);
  } catch (error: any) {
    logger.error('Error handling webhook', error);
    if (error.message === 'Booking not found') {
      return res.status(404).json({ error: error.message });
    }
    // Return 200 even on some errors to prevent webhook provider from retrying indefinitely if it's our fault
    // But for a missing booking, 404 is appropriate.
    res.status(500).json({ error: 'Internal server error' });
  }
};
