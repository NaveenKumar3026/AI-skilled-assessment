import prisma from '../config/database';
import { ReviewDecision, AssessorDecision, UserRole } from '../types';
import { CreateReviewInput } from '../validators/assessor.validator';
import { generateVerificationId } from '../utils/crypto';
import { logAuditEvent } from '../middleware/audit.middleware';

export class AssessorService {
  static async getCandidatesQueue() {
    return prisma.candidateProfile.findMany({
      where: {
        assessmentStatus: { in: ['UNDER_ASSESSOR_REVIEW', 'EVIDENCE_UPLOADED'] },
      },
      include: {
        user: { select: { name: true, email: true, phone: true, location: true } },
        skills: { orderBy: { confidence: 'desc' } },
        evidences: true,
        skillScore: true,
        assessments: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  static async getAssessmentForReview(assessmentId: string) {
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        jobRole: true,
        responses: { include: { question: true } },
        candidateProfile: {
          include: {
            user: { select: { name: true, email: true, phone: true } },
            skills: true,
            evidences: true,
            skillGaps: true,
            skillScore: true,
          },
        },
        assessorReview: true,
      },
    });
    if (!assessment) throw new Error('Assessment not found.');
    return assessment;
  }

  /**
   * Assessor Decision & Certification in Transactional Boundary (Requirements 24 & 26)
   */
  static async createReview(assessorId: string, data: CreateReviewInput) {
    return prisma.$transaction(async (tx) => {
      const assessment = await tx.assessment.findUnique({
        where: { id: data.assessmentId },
        include: { candidateProfile: true },
      });
      if (!assessment) throw new Error('Assessment not found.');

      // Prevent race conditions and duplicate reviews
      const existing = await tx.assessorReview.findUnique({ where: { assessmentId: data.assessmentId } });
      if (existing) throw new Error('This assessment has already been reviewed. Use update instead.');

      const review = await tx.assessorReview.create({
        data: {
          assessmentId: data.assessmentId,
          assessorId,
          candidateProfileId: assessment.candidateProfileId,
          decision: data.decision as ReviewDecision,
          remarks: data.remarks,
          scoreOverrides: data.scoreOverrides ? JSON.stringify(data.scoreOverrides) : undefined,
        },
      });

      let newStatus: AssessorDecision = 'PENDING';
      let assessmentStatus = assessment.candidateProfile.assessmentStatus;

      if (data.decision === 'APPROVED') {
        newStatus = 'APPROVED';
        assessmentStatus = 'CERTIFIED';

        const overrides = data.scoreOverrides || {};
        const verificationId = generateVerificationId(); // e.g. RPL-7F4K-92MX-X8P2
        const certId = `RPL-IND-2026-EL4-${Math.floor(1000 + Math.random() * 9000)}`;

        await tx.candidateProfile.update({
          where: { id: assessment.candidateProfileId },
          data: {
            assessorDecision: 'APPROVED',
            assessorRemarks: data.remarks,
            assessmentStatus: 'CERTIFIED',
            certificateId: certId,
            certifiedAt: new Date(),
            ...(overrides.knowledge !== undefined && { knowledgeScore: overrides.knowledge }),
            ...(overrides.practical !== undefined && { practicalScore: overrides.practical }),
            ...(overrides.safety !== undefined && { safetyScore: overrides.safety }),
            ...(overrides.evidence !== undefined && { evidenceScore: overrides.evidence }),
            ...(overrides.communication !== undefined && { communicationScore: overrides.communication }),
          },
        });

        const updatedProfile = await tx.candidateProfile.findUnique({
          where: { id: assessment.candidateProfileId },
          include: { selectedJobRole: true },
        });

        if (updatedProfile) {
          await tx.certification.upsert({
            where: { candidateProfileId: assessment.candidateProfileId },
            create: {
              candidateProfileId: assessment.candidateProfileId,
              certificateId: certId,
              verificationId,
              jobRoleTitle: updatedProfile.selectedJobRole?.title || 'Trade Specialist',
              nsqfLevel: updatedProfile.nsqfTargetLevel,
              issuedAt: new Date(),
              isValid: true,
            },
            update: {
              isValid: true,
              verificationId,
            },
          });
        }

        await tx.auditLog.create({
          data: {
            actorId: assessorId,
            actorName: 'Assessor',
            actorRole: 'ASSESSOR',
            action: 'CERTIFICATION_APPROVED',
            details: `Assessor approved RPL certification. Certificate ID: ${certId}, Verification ID: ${verificationId}`,
            entityType: 'CandidateProfile',
            entityId: assessment.candidateProfileId,
            resourceType: 'Certification',
            resourceId: verificationId,
          },
        });
      } else if (data.decision === 'REQUEST_REASSESSMENT') {
        newStatus = 'REQUEST_REASSESSMENT';
        assessmentStatus = 'REASSESSMENT_NEEDED';

        await tx.candidateProfile.update({
          where: { id: assessment.candidateProfileId },
          data: {
            assessorDecision: 'REQUEST_REASSESSMENT',
            assessorRemarks: data.remarks,
            assessmentStatus: 'REASSESSMENT_NEEDED',
          },
        });
      } else if (data.decision === 'REJECTED') {
        newStatus = 'REJECTED';

        await tx.candidateProfile.update({
          where: { id: assessment.candidateProfileId },
          data: {
            assessorDecision: 'REJECTED',
            assessorRemarks: data.remarks,
            assessmentStatus: 'NOT_STARTED',
          },
        });
      }

      await tx.assessment.update({
        where: { id: data.assessmentId },
        data: { status: 'REVIEWED' },
      });

      return { review, decision: data.decision, newStatus, assessmentStatus };
    });
  }

  static async updateReview(reviewId: string, assessorId: string, data: Partial<CreateReviewInput>) {
    const review = await prisma.assessorReview.findUnique({ where: { id: reviewId } });
    if (!review) throw new Error('Review not found.');
    if (review.assessorId !== assessorId) throw new Error('Unauthorized: this is not your review.');

    return prisma.assessorReview.update({
      where: { id: reviewId },
      data: {
        ...(data.decision && { decision: data.decision as ReviewDecision }),
        ...(data.remarks && { remarks: data.remarks }),
        ...(data.scoreOverrides && { scoreOverrides: JSON.stringify(data.scoreOverrides) }),
      },
    });
  }
}
