import { z } from 'zod';
import { securityConfig } from '../config/security.config';

/**
 * Common Parameter & Query Validators
 */

export const safeIdSchema = z
  .string()
  .trim()
  .min(1, 'ID cannot be empty')
  .max(100, 'ID exceeds maximum length')
  .regex(/^[a-zA-Z0-9_-]+$/, 'ID contains invalid characters');

export const idParamSchema = z.object({
  id: safeIdSchema,
});

export const paginationQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => !isNaN(val) && val >= 1, { message: 'Page must be a positive integer' }),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : securityConfig.pagination.defaultLimit))
    .refine(
      (val) => !isNaN(val) && val >= 1 && val <= securityConfig.pagination.maxLimit,
      { message: `Limit must be between 1 and ${securityConfig.pagination.maxLimit}` }
    ),
});
