import { z } from 'zod';

export const createAssessmentSchema = z.object({
  jobRoleId: z.string().min(1, 'Job role ID is required'),
  type: z.enum(['KNOWLEDGE', 'VOICE', 'PRACTICAL']).default('KNOWLEDGE'),
});

export const submitResponseSchema = z.object({
  questionId: z.string().min(1),
  selectedOptionId: z.string().min(1),
});

export const submitAssessmentSchema = z.object({
  responses: z.array(submitResponseSchema).optional(),
});

export type CreateAssessmentInput = z.infer<typeof createAssessmentSchema>;
export type SubmitResponseInput = z.infer<typeof submitResponseSchema>;
