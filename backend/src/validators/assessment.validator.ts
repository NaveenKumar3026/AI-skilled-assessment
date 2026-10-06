import { z } from 'zod';
import { safeIdSchema } from './common.validator';

export const createAssessmentSchema = z.object({
  jobRoleId: safeIdSchema,
  type: z.enum(['KNOWLEDGE', 'VOICE', 'PRACTICAL']).default('KNOWLEDGE'),
});

export const submitResponseSchema = z.object({
  questionId: safeIdSchema,
  selectedOptionId: safeIdSchema,
});

export const submitAssessmentSchema = z.object({
  responses: z.array(submitResponseSchema).optional(),
});

export type CreateAssessmentInput = z.infer<typeof createAssessmentSchema>;
export type SubmitResponseInput = z.infer<typeof submitResponseSchema>;
