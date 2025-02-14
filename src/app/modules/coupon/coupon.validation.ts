import { z } from 'zod';

export const couponValidation = {
   create: z.object({
      name: z.string().min(1, 'Name is required'),
   }),
   update: z.object({
      id: z.string().uuid('Invalid ID format'),
      name: z.string().optional(),
   }),
};

export const updateCouponValidationSchema = z.object({
   body: z
      .object({
         code: z.string().trim().toUpperCase().optional(),
         discountType: z.enum(['Flat', 'Percentage']).optional(),
         discountValue: z.number().min(0).optional(),
         minOrderAmount: z.number().min(0).optional(),
         maxDiscountAmount: z.number().nullable().optional(),
         startDate: z.date().optional(),
         endDate: z.date().optional(),
         isActive: z.boolean().optional(),
      })
      .strict(),
});
