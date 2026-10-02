import { Request, Response } from 'express';
import * as bookingService from '../services/booking.service.js';
import logger from '../config/logger.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const booking = await bookingService.createBooking(req.user.id, req.body);
    res.status(201).json(booking);
  } catch (error: any) {
    logger.error('Error creating booking', error);
    if (error.message === 'Test not available at this centre') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await bookingService.getBookings(req.user.id);
    res.status(200).json(bookings);
  } catch (error: any) {
    logger.error('Error fetching bookings', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
