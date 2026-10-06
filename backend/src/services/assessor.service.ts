import prisma from '../config/database';
import { ReviewDecision, AssessorDecision } from '../types';
import { CreateReviewInput } from '../validators/assessor.validator';

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

  static async createReview(assessorId: string, data: CreateReviewInput) {
    const assessment = await prisma.assessment.findUnique({
      where: { id: data.assessmentId },
      include: { candidateProfile: true },
    });
    if (!assessment) throw new Error('Assessment not found.');

    const existing = await prisma.assessorReview.findUnique({ where: { assessmentId: data.assessmentId } });
    if (existing) throw new Error('This assessment has already been reviewed. Use update instead.');

    const review = await prisma.assessorReview.create({
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
      const certId = `RPL-IND-2026-EL4-${Math.floor(1000 + Math.random() * 9000)}`;

      await prisma.candidateProfile.update({
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

      const updatedProfile = await prisma.candidateProfile.findUnique({
        where: { id: assessment.candidateProfileId },
        include: { selectedJobRole: true },
      });

      if (updatedProfile) {
        await prisma.certification.upsert({
          where: { candidateProfileId: assessment.candidateProfileId },
          create: {
            candidateProfileId: assessment.candidateProfileId,
            certificateId: certId,
            jobRoleTitle: updatedProfile.selectedJobRole?.title || 'Trade Specialist',
            nsqfLevel: updatedProfile.nsqfTargetLevel,
            issuedAt: new Date(),
            isValid: true,
          },
          update: { isValid: true },
        });
      }

      await prisma.auditLog.create({
        data: {
          actorId: assessorId,
          actorName: 'Assessor',
          actorRole: 'ASSESSOR',
          action: 'Certification Approval Signed',
          details: `Assessor approved RPL certification for candidate profile ${assessment.candidateProfileId}. Certificate ID: ${certId}`,
          entityType: 'CandidateProfile',
          entityId: assessment.candidateProfileId,
        },
      });
    } else if (data.decision === 'REQUEST_REASSESSMENT') {
      newStatus = 'REQUEST_REASSESSMENT';
      assessmentStatus = 'REASSESSMENT_NEEDED';

      await prisma.candidateProfile.update({
        where: { id: assessment.candidateProfileId },
        data: {
          assessorDecision: 'REQUEST_REASSESSMENT',
          assessorRemarks: data.remarks,
          assessmentStatus: 'REASSESSMENT_NEEDED',
        },
      });
    } else if (data.decision === 'REJECTED') {
      newStatus = 'REJECTED';

      await prisma.candidateProfile.update({
        where: { id: assessment.candidateProfileId },
        data: {
          assessorDecision: 'REJECTED',
          assessorRemarks: data.remarks,
          assessmentStatus: 'NOT_STARTED',
        },
      });
    }

    await prisma.assessment.update({
      where: { id: data.assessmentId },
      data: { status: 'REVIEWED' },
    });

    return { review, decision: data.decision, newStatus, assessmentStatus };
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
