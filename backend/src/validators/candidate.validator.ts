import { z } from 'zod';

export const updateProfileSchema = z.object({
  age: z.number().int().min(14).max(80).optional(),
  yearsOfExperience: z.number().int().min(0).max(60).optional(),
  primaryTrade: z.string().min(2).optional(),
  nsqfTargetLevel: z.number().int().min(1).max(8).optional(),
  selectedJobRoleId: z.string().optional(),
  experienceDescription: z.string().optional(),
  location: z.string().optional(),
  language: z.string().optional(),
});

export const analyzeExperienceSchema = z.object({
  description: z.string().min(20, 'Please describe your experience in at least 20 characters'),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type AnalyzeExperienceInput = z.infer<typeof analyzeExperienceSchema>;
