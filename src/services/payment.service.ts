import prisma from '../utils/prisma.js';
import { BookingStatus } from '@prisma/client';
import crypto from 'crypto';

export const processPayment = async (userId: string, bookingId: string, amount: number) => {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });

  if (!booking) {
    throw new Error('Booking not found');
  }

  if (booking.userId !== userId) {
    throw new Error('Unauthorized access to booking');
  }

  if (booking.status !== BookingStatus.PENDING) {
    throw new Error('Booking is not in PENDING state');
  }

  if (booking.amount !== amount) {
    throw new Error('Incorrect payment amount');
  }

  // Simulate payment processing (80% success rate)
  const isSuccess = Math.random() > 0.2;
  const paymentStatus = isSuccess ? 'SUCCESS' : 'FAILED';
  const paymentId = crypto.randomUUID(); // Mock payment provider ID

  // In a real scenario, we might call a 3rd party here and wait for webhook.
  // For simulation, we return the status and also optionally process it directly
  // or simulate webhook delivery. Let's just return the status and process it.
  
  // Here we update it directly as per the first requirement
  const updatedStatus = isSuccess ? BookingStatus.CONFIRMED : BookingStatus.FAILED;
  
  await prisma.booking.update({
    where: { id: bookingId },
    data: { 
      status: updatedStatus,
      paymentId: paymentId
    }
  });

  return { paymentId, bookingId, status: paymentStatus };
};

export const handleWebhook = async (paymentId: string, bookingId: string, status: 'SUCCESS' | 'FAILED') => {
  // Idempotency check: find if booking already has this paymentId and is processed
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });

  if (!booking) {
    throw new Error('Booking not found');
  }

  // If already confirmed or failed with this paymentId, ignore (Idempotent)
  if (booking.paymentId === paymentId && booking.status !== BookingStatus.PENDING) {
    return { message: 'Webhook already processed' };
  }
  
  // If a different payment was already successful, we shouldn't overwrite it with a failure of another payment.
  // But if it's the same payment, or it's still pending, update it.
  if (booking.status === BookingStatus.CONFIRMED) {
    return { message: 'Booking already confirmed' };
  }

  const updatedStatus = status === 'SUCCESS' ? BookingStatus.CONFIRMED : BookingStatus.FAILED;

  await prisma.booking.update({
    where: { id: bookingId },
    data: { 
      status: updatedStatus,
      paymentId: paymentId
    }
  });

  return { message: 'Webhook processed successfully' };
};
