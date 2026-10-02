import prisma from '../utils/prisma.js';
import { BookingStatus } from '@prisma/client';

export const createBooking = async (userId: string, data: { testId: string; centreId: string; appointmentDate: string }) => {

  const centreTest = await prisma.centreTest.findUnique({
    where: {
      centreId_testId: {
        centreId: data.centreId,
        testId: data.testId
      }
    }
  });

  if (!centreTest) {
    throw new Error('Test not available at this centre');
  }

  const booking = await prisma.booking.create({
    data: {
      userId,
      testId: data.testId,
      centreId: data.centreId,
      appointmentDate: new Date(data.appointmentDate),
      amount: centreTest.price,
      status: BookingStatus.PENDING
    }
  });

  return booking;
};

export const getBookings = async (userId: string) => {
  return prisma.booking.findMany({
    where: { userId },
    include: {
      test: true,
      centre: true
    }
  });
};
