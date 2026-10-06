import { z } from 'zod';
import { securityConfig } from '../config/security.config';

/**
 * Strong Password Schema (Requirement 32)
 */
export const passwordSchema = z
  .string()
  .min(securityConfig.passwords.minLength, `Password must be at least ${securityConfig.passwords.minLength} characters`)
  .max(securityConfig.passwords.maxLength, 'Password must not exceed 128 characters')
  .refine(
    (val) => /[A-Z]/.test(val),
    { message: 'Password must contain at least one uppercase letter' }
  )
  .refine(
    (val) => /[a-z]/.test(val),
    { message: 'Password must contain at least one lowercase letter' }
  )
  .refine(
    (val) => /[0-9]/.test(val),
    { message: 'Password must contain at least one number' }
  )
  .refine(
    (val) => /[^A-Za-z0-9]/.test(val),
    { message: 'Password must contain at least one special character' }
  )
  .refine(
    (val) => !securityConfig.passwords.blacklisted.includes(val.toLowerCase()),
    { message: 'Password is too common and easily guessed. Please choose a stronger password.' }
  );

// For backwards compatibility during demo login where existing users might have simpler passwords
export const loginPasswordSchema = z
  .string()
  .min(1, 'Password is required')
  .max(128, 'Password exceeds maximum length');

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80),
    email: z.string().trim().toLowerCase().email('Invalid email address').max(120),
    phone: z.string().trim().regex(/^[0-9+ -]{10,15}$/, 'Invalid phone number format (10-15 digits)'),
    password: passwordSchema,
    confirmPassword: z.string().optional(),
    location: z.string().trim().min(2, 'Location is required').max(100),
    primaryTrade: z.string().trim().min(2, 'Primary trade is required').max(100),
    yearsOfExperience: z.number().int().min(0, 'Years of experience cannot be negative').max(60, 'Invalid years of experience'),
    language: z.enum(['en', 'hi', 'ta', 'te', 'kn']).optional().default('en'),
  })
  .refine(
    (data) => !data.confirmPassword || data.password === data.confirmPassword,
    {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }
  );

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  password: loginPasswordSchema,
});

export const refreshSchema = z.object({
  refreshToken: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
