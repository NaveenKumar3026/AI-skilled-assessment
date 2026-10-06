import { z } from 'zod';

export const createReviewSchema = z.object({
  assessmentId: z.string().min(1, 'Assessment ID is required'),
  decision: z.enum(['APPROVED', 'REQUEST_REASSESSMENT', 'REJECTED']),
  remarks: z.string().min(10, 'Remarks must be at least 10 characters'),
  scoreOverrides: z
    .object({
      knowledge: z.number().min(0).max(100).optional(),
      practical: z.number().min(0).max(100).optional(),
      safety: z.number().min(0).max(100).optional(),
      evidence: z.number().min(0).max(100).optional(),
      communication: z.number().min(0).max(100).optional(),
    })
    .optional(),
});

export const updateReviewSchema = createReviewSchema.partial();

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
