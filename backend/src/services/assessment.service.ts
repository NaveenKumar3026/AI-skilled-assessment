import prisma from '../config/database';
import { AIService } from './ai.service';

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

  static async getAssessmentById(assessmentId: string) {
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        jobRole: true,
        responses: { include: { question: true } },
        assessorReview: { include: { assessor: { select: { name: true, email: true } } } },
      },
    });
    if (!assessment) throw new Error('Assessment not found.');
    return assessment;
  }

  static async getQuestions(jobRoleId: string) {
    return prisma.question.findMany({
      where: { jobRoleId },
      orderBy: { difficultyLevel: 'asc' },
    });
  }

  static async submitResponse(assessmentId: string, questionId: string, selectedOptionId: string) {
    const assessment = await prisma.assessment.findUnique({ where: { id: assessmentId } });
    if (!assessment) throw new Error('Assessment not found.');
    if (assessment.status === 'COMPLETED') throw new Error('Assessment is already completed.');

    const question = await prisma.question.findUnique({ where: { id: questionId } });
    if (!question) throw new Error('Question not found.');

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

  static async submitAssessment(assessmentId: string, userId: string) {
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: { responses: true, candidateProfile: true },
    });
    if (!assessment) throw new Error('Assessment not found.');
    if (assessment.status === 'COMPLETED') throw new Error('Assessment already submitted.');

    const total = assessment.totalQuestions;
    const correct = assessment.responses.filter((r) => r.isCorrect).length;
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;

    const updatedAssessment = await prisma.assessment.update({
      where: { id: assessmentId },
      data: {
        status: 'COMPLETED',
        score,
        answeredQuestions: assessment.responses.length,
        completedAt: new Date(),
      },
    });

    // Update candidate knowledge score and status
    await prisma.candidateProfile.update({
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

    return { assessment: updatedAssessment, score, correct, total, aiRecommendation: aiRec };
  }
}
