import prisma from '../config/database';
import { AIService } from './ai.service';
import { AuthUser } from '../types';
import { logAuditEvent } from '../middleware/audit.middleware';

export class AssessmentService {
  static async createAssessment(userId: string, jobRoleId: string, type: 'KNOWLEDGE' | 'VOICE' | 'PRACTICAL') {
    const profile = await prisma.candidateProfile.findUnique({ where: { userId } });
    if (!profile) throw new Error('Candidate profile not found.');

    const jobRole = await prisma.jobRole.findUnique({ where: { id: jobRoleId } });
    if (!jobRole) throw new Error('Job role not found.');

    const questions = await prisma.question.findMany({ where: { jobRoleId }, orderBy: { difficultyLevel: 'asc' } });

    const assessment = await prisma.assessment.create({
      data: {
        candidateProfileId: profile.id,
        jobRoleId,
        type,
        status: 'IN_PROGRESS',
        totalQuestions: questions.length,
        startedAt: new Date(),
      },
      include: { jobRole: true },
    });

    // Update candidate status
    await prisma.candidateProfile.update({
      where: { id: profile.id },
      data: { assessmentStatus: 'KNOWLEDGE_IN_PROGRESS' },
    });

    await logAuditEvent({
      actorId: userId,
      action: 'ASSESSMENT_STARTED',
      resourceType: 'Assessment',
      resourceId: assessment.id,
      details: `Started ${type} assessment for job role ${jobRole.title}`,
    });

    return { assessment, questions };
  }

  static async getAssessments(userId: string) {
    const profile = await prisma.candidateProfile.findUnique({ where: { userId } });
    if (!profile) throw new Error('Candidate profile not found.');

    return prisma.assessment.findMany({
      where: { candidateProfileId: profile.id },
      include: { jobRole: true, _count: { select: { responses: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Object-Level Authorization: Prevent IDOR (Requirement 5)
   */
  static async getAssessmentById(assessmentId: string, user: AuthUser) {
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        jobRole: true,
        responses: { include: { question: true } },
        candidateProfile: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
        assessorReview: { include: { assessor: { select: { name: true, email: true } } } },
      },
    });
    if (!assessment) throw new Error('Assessment not found.');

    // IDOR Protection: Candidate can strictly only access their own assessment
    if (user.role === 'CANDIDATE' && assessment.candidateProfile.userId !== user.id) {
      throw new Error('Access denied: You are not authorized to view this assessment.');
    }

    return assessment;
  }

  static async getQuestions(jobRoleId: string) {
    return prisma.question.findMany({
      where: { jobRoleId },
      orderBy: { difficultyLevel: 'asc' },
    });
  }

  /**
   * Submit Answer with IDOR verification and immutability checks (Requirement 25)
   */
  static async submitResponse(
    assessmentId: string,
    questionId: string,
    selectedOptionId: string,
    user: AuthUser
  ) {
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: { candidateProfile: true },
    });
    if (!assessment) throw new Error('Assessment not found.');

    // Ownership verification
    if (user.role === 'CANDIDATE' && assessment.candidateProfile.userId !== user.id) {
      throw new Error('Access denied: You do not own this assessment.');
    }

    // Answers are immutable once submitted
    if (assessment.status === 'COMPLETED' || assessment.status === 'REVIEWED') {
      throw new Error('Assessment answers are immutable after submission.');
    }

    const question = await prisma.question.findUnique({ where: { id: questionId } });
    if (!question) throw new Error('Question not found.');

    // Authority: backend calculates answer correctness
    const isCorrect = question.correctOptionId === selectedOptionId;

    // Upsert response
    const existing = await prisma.assessmentResponse.findFirst({
      where: { assessmentId, questionId },
    });

    let response;
    if (existing) {
      response = await prisma.assessmentResponse.update({
        where: { id: existing.id },
        data: { selectedOptionId, isCorrect },
      });
    } else {
      response = await prisma.assessmentResponse.create({
        data: { assessmentId, questionId, selectedOptionId, isCorrect },
      });
    }

    const answeredCount = await prisma.assessmentResponse.count({ where: { assessmentId } });
    await prisma.assessment.update({
      where: { id: assessmentId },
      data: { answeredQuestions: answeredCount },
    });

    const aiEval = await AIService.evaluateAnswer(questionId, selectedOptionId, question.correctOptionId);

    return {
      response,
      isCorrect,
      correctOptionId: question.correctOptionId,
      explanation: question.explanation,
      simpleExplanation: question.simpleExplanation,
      aiEvaluation: aiEval,
    };
  }

  /**
   * Submit assessment in transactional boundary to prevent race conditions (Requirement 26)
   */
  static async submitAssessment(assessmentId: string, user: AuthUser) {
    return prisma.$transaction(async (tx) => {
      const assessment = await tx.assessment.findUnique({
        where: { id: assessmentId },
        include: { responses: true, candidateProfile: true },
      });
      if (!assessment) throw new Error('Assessment not found.');

      // IDOR ownership check
      if (user.role === 'CANDIDATE' && assessment.candidateProfile.userId !== user.id) {
        throw new Error('Access denied: You do not own this assessment.');
      }

      if (assessment.status === 'COMPLETED' || assessment.status === 'REVIEWED') {
        throw new Error('Assessment already submitted.');
      }

      const total = assessment.totalQuestions;
      const correct = assessment.responses.filter((r) => r.isCorrect).length;
      // Backend authoritative score calculation (never accept score from client)
      const score = total > 0 ? Math.round((correct / total) * 100) : 0;

      const updatedAssessment = await tx.assessment.update({
        where: { id: assessmentId },
        data: {
          status: 'COMPLETED',
          score,
          answeredQuestions: assessment.responses.length,
          completedAt: new Date(),
        },
      });

      // Update candidate knowledge score and status
      await tx.candidateProfile.update({
        where: { id: assessment.candidateProfileId },
        data: {
          knowledgeScore: score,
          assessmentStatus: 'EVIDENCE_UPLOADED',
        },
      });

      const aiRec = await AIService.generateRecommendation(
        {},
        {
          knowledge: score,
          practical: assessment.candidateProfile.practicalScore,
          safety: assessment.candidateProfile.safetyScore,
          evidence: assessment.candidateProfile.evidenceScore,
          communication: assessment.candidateProfile.communicationScore,
        }
      );

      await logAuditEvent({
        actorId: user.id,
        action: 'ASSESSMENT_SUBMITTED',
        resourceType: 'Assessment',
        resourceId: assessmentId,
        details: `Assessment completed with calculated score ${score}% (${correct}/${total} correct)`,
      });

      return { assessment: updatedAssessment, score, correct, total, aiRecommendation: aiRec };
    });
  }
}
