import prisma from '../config/database';
import { AIService } from './ai.service';
import { AuthUser } from '../types';

export class PracticalService {
  static async createPracticalAssessment(
    userId: string,
    data: { taskTitle: string; taskInstructions: string }
  ) {
    const profile = await prisma.candidateProfile.findUnique({ where: { userId } });
    if (!profile) throw new Error('Candidate profile not found.');

    const practical = await prisma.practicalAssessment.create({
      data: {
        candidateProfileId: profile.id,
        taskTitle: data.taskTitle,
        taskInstructions: data.taskInstructions,
      },
    });

    await prisma.candidateProfile.update({
      where: { id: profile.id },
      data: { assessmentStatus: 'PRACTICAL_IN_PROGRESS' },
    });

    return practical;
  }

  /**
   * Object-Level Authorization: Prevent IDOR (Requirement 5)
   */
  static async getPracticalAssessment(id: string, user: AuthUser) {
    const practical = await prisma.practicalAssessment.findUnique({
      where: { id },
      include: { candidateProfile: true },
    });
    if (!practical) throw new Error('Practical assessment not found.');

    if (user.role === 'CANDIDATE' && practical.candidateProfile.userId !== user.id) {
      throw new Error('Access denied: You are not authorized to view this practical assessment.');
    }

    return practical;
  }

  /**
   * Analyze practical video with IDOR ownership verification
   */
  static async analyzePracticalVideo(practicalId: string, user: AuthUser, videoPath?: string) {
    const profile = await prisma.candidateProfile.findUnique({ where: { userId: user.id } });
    if (!profile) throw new Error('Candidate profile not found.');

    const practical = await prisma.practicalAssessment.findUnique({ where: { id: practicalId } });
    if (!practical) throw new Error('Practical assessment not found.');

    if (user.role === 'CANDIDATE' && practical.candidateProfileId !== profile.id) {
      throw new Error('Access denied: You do not own this practical assessment.');
    }

    const aiResult = await AIService.analyzePracticalVideo(
      videoPath || 'demo-video',
      practical.taskTitle
    );

    const { taskCompletion, safetyCompliance, toolHandling, procedureAccuracy, overallPractical, observations, timelineEvents } = aiResult.data;

    const updated = await prisma.practicalAssessment.update({
      where: { id: practicalId },
      data: {
        videoPath: videoPath,
        observations: JSON.stringify(observations),
        timelineEvents: JSON.stringify(timelineEvents),
        taskCompletionScore: taskCompletion,
        safetyComplianceScore: safetyCompliance,
        toolHandlingScore: toolHandling,
        procedureAccuracyScore: procedureAccuracy,
        overallPracticalScore: overallPractical,
        aiConfidence: aiResult.confidence,
        analyzedAt: new Date(),
      },
    });

    // Update candidate practical and safety scores
    await prisma.candidateProfile.update({
      where: { id: profile.id },
      data: {
        practicalScore: overallPractical,
        safetyScore: safetyCompliance,
        assessmentStatus: 'EVIDENCE_UPLOADED',
      },
    });

    return { practical: updated, aiResult };
  }
}
