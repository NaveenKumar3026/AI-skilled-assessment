import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits').max(15),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  location: z.string().min(2, 'Location is required'),
  primaryTrade: z.string().min(2, 'Primary trade is required'),
  yearsOfExperience: z.number().int().min(0).max(60),
  language: z.enum(['en', 'hi', 'ta', 'te', 'kn']).optional().default('en'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
