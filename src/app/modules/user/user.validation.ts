import { z } from 'zod';
import { UserRole } from './user.interface';

const clientInfoSchema = z.object({
   device: z.enum(['pc', 'mobile']).optional().default('pc'), // Allow only 'pc' or 'mobile'
   browser: z.string().min(1, 'Browser name is required'),
   ipAddress: z.string().min(1, 'IP address is required'),
   pcName: z.string().optional(), // Optional field
   os: z.string().optional(), // Optional field
   userAgent: z.string().min(1, 'User agent is required'),
});

const userValidationSchema = z.object({
   body: z.object({
      email: z.string().email('Invalid email address'),
      password: z.string().min(6, 'Password must be at least 6 characters long'),
      name: z.string().min(1, 'Name is required'),
      role: z.enum([UserRole.USER, UserRole.ADMIN]).default(UserRole.USER), // Match enum values in your code
      clientInfo: clientInfoSchema // Nested schema for client info
   })
});

const customerInfoValidationSchema = z.object({
   body: z
      .object({
         phoneNo: z
            .string()
            .regex(/^\d{11}$/, 'Phone number must be exactly 11 digits long')
            .optional(),
         gender: z
            .enum(['Male', 'Female', 'Other'])
            .default('Other')
            .optional(),
         dateOfBirth: z
            .string()
            .optional()
            .refine((value) => !value || !isNaN(Date.parse(value)), {
               message: 'Invalid date format. Must be a valid date.',
            })
            .optional(),
         address: z
            .string()
            .optional(),
         photo: z
            .string()
            .regex(
               /^(http(s)?:\/\/.*\.(?:png|jpg|jpeg))$/,
               'Invalid photo URL format. Must be a valid image URL.'
            )
            .optional(),
      })
      .strict(),
});

export const UserValidation = {
   userValidationSchema,
   customerInfoValidationSchema,
};
