import { z } from 'zod';

export const signupSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(1)
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string()
  })
});

export const createCentreSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    location: z.string().min(1)
  })
});

export const createTestSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    description: z.string().optional()
  })
});

export const addTestToCentreSchema = z.object({
  body: z.object({
    testId: z.string().uuid(),
    price: z.number().positive()
  }),
  params: z.object({
    centreId: z.string().uuid()
  })
});

export const createBookingSchema = z.object({
  body: z.object({
    testId: z.string().uuid(),
    centreId: z.string().uuid(),
    appointmentDate: z.string().datetime()
  })
});

export const mockPaymentSchema = z.object({
  body: z.object({
    bookingId: z.string().uuid(),
    amount: z.number().positive()
  })
});

export const paymentWebhookSchema = z.object({
  body: z.object({
    paymentId: z.string().min(1),
    bookingId: z.string().uuid(),
    status: z.enum(['SUCCESS', 'FAILED'])
  })
});
