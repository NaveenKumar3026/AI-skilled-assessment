import { z } from 'zod';
import { safeIdSchema } from './common.validator';

export const updateProfileSchema = z.object({
  age: z.number().int().min(14, 'Age must be at least 14').max(80, 'Age must not exceed 80').optional(),
  yearsOfExperience: z.number().int().min(0).max(60).optional(),
  primaryTrade: z.string().trim().min(2).max(100).optional(),
  nsqfTargetLevel: z.number().int().min(1).max(8).optional(),
  selectedJobRoleId: safeIdSchema.optional(),
  experienceDescription: z.string().trim().max(5000).optional(),
  location: z.string().trim().max(100).optional(),
  language: z.enum(['en', 'hi', 'ta', 'te', 'kn']).optional(),
});

export const analyzeExperienceSchema = z.object({
  description: z.string().trim().min(10, 'Please describe your experience in at least 10 characters').max(5000),
});

export const addExperienceSchema = z.object({
  description: z.string().trim().min(5, 'Description must be at least 5 characters').max(2000),
  yearsOfExperience: z.number().int().min(0).max(60),
  employer: z.string().trim().max(120).optional(),
  role: z.string().trim().max(120).optional(),
  location: z.string().trim().max(120).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type AnalyzeExperienceInput = z.infer<typeof analyzeExperienceSchema>;
export type AddExperienceInput = z.infer<typeof addExperienceSchema>;
