import { z } from 'zod';

export const customerValidation = {
  create: z.object({
    name: z.string().min(1, 'Name is required'),
  }),
  update: z.object({
    id: z.string().uuid('Invalid ID format'),
    name: z.string().optional(),
  }),
};
