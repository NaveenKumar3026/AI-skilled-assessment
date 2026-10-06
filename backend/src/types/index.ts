import { Request } from 'express';

// ─── Enums (TypeScript definitions) ──────────────────────────────────────────

export type UserRole = 'CANDIDATE' | 'ASSESSOR' | 'ADMIN';

export type AssessmentStatus =
  | 'NOT_STARTED'
  | 'PROFILING'
  | 'KNOWLEDGE_IN_PROGRESS'
  | 'VOICE_IN_PROGRESS'
  | 'PRACTICAL_IN_PROGRESS'
  | 'EVIDENCE_UPLOADED'
  | 'UNDER_ASSESSOR_REVIEW'
  | 'CERTIFIED'
  | 'REASSESSMENT_NEEDED';

export type AssessorDecision = 'PENDING' | 'APPROVED' | 'REQUEST_REASSESSMENT' | 'REJECTED';

export type SkillCategory = 'CORE' | 'SAFETY' | 'TOOL' | 'DIAGNOSTIC' | 'SOFT';

export type SkillLevel = 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export type DemandLevel = 'VERY_HIGH' | 'HIGH' | 'MODERATE';

export type AssessmentType = 'KNOWLEDGE' | 'VOICE' | 'PRACTICAL';

export type AssessmentProgressStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REVIEWED';

export type EvidenceType =
  | 'EXPERIENCE_LETTER'
  | 'CONTRACTOR_AFFIDAVIT'
  | 'SALARY_SLIP'
  | 'SITE_PHOTO'
  | 'ID_PROOF';

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'NEEDS_REVIEW' | 'FLAGGED';

export type GapStatus = 'PASS' | 'GAP' | 'PARTIAL';

export type ReviewDecision = 'APPROVED' | 'REQUEST_REASSESSMENT' | 'REJECTED';

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
  iat?: number;
  exp?: number;
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: PaginationMeta;
}

// ─── AI Output ────────────────────────────────────────────────────────────────

export interface AIOutput<T> {
  data: T;
  aiGenerated: true;
  confidence: number;
  requiresHumanValidation: true;
}

// ─── Extend Express Request ───────────────────────────────────────────────────

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
