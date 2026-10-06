import prisma from '../config/database';
import { AIService } from './ai.service';
import { AuthUser } from '../types';

export class ResultsService {
  /**
   * Object-Level Authorization: Prevent IDOR (Requirement 5)
   */
  static async getAssessmentResults(assessmentId: string, user: AuthUser) {
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        jobRole: true,
        responses: { include: { question: true } },
        candidateProfile: {
          include: {
            user: { select: { id: true, name: true } },
            skillScore: true,
            skillGaps: true,
          },
        },
        assessorReview: true,
      },
    });
    if (!assessment) throw new Error('Assessment not found.');

    // IDOR check: Candidate can only access their own assessment results
    if (user.role === 'CANDIDATE' && assessment.candidateProfile.user.id !== user.id) {
      throw new Error('Access denied: You do not own these assessment results.');
    }

    const profile = assessment.candidateProfile;
    const scores = {
      knowledge: profile.knowledgeScore,
      practical: profile.practicalScore,
      safety: profile.safetyScore,
      evidence: profile.evidenceScore,
      communication: profile.communicationScore,
    };

    const aiRec = await AIService.generateRecommendation({}, scores);

    return {
      assessment,
      scores,
      overallScore: AIService.calculateOverallScore(scores),
      aiRecommendation: aiRec,
    };
  }

  /**
   * Object-Level Authorization: Prevent IDOR on Skill Gaps (Requirement 5)
   */
  static async getSkillGaps(candidateProfileId: string, user: AuthUser) {
    const profile = await prisma.candidateProfile.findUnique({
      where: { id: candidateProfileId },
      include: { skills: true },
    });
    if (!profile) throw new Error('Candidate profile not found.');

    // IDOR check
    if (user.role === 'CANDIDATE' && profile.userId !== user.id) {
      throw new Error('Access denied: You cannot view skill gaps of another candidate.');
    }

    const gaps = await prisma.skillGap.findMany({
      where: { candidateProfileId },
      orderBy: { status: 'asc' },
    });

    if (gaps.length === 0) {
      return ResultsService.calculateAndSaveSkillGaps(candidateProfileId, profile.selectedJobRoleId || 'role-electrician-l4');
    }

    return gaps;
  }

  static async calculateAndSaveSkillGaps(candidateProfileId: string, jobRoleId: string) {
    const profile = await prisma.candidateProfile.findUnique({
      where: { id: candidateProfileId },
      include: { skills: true },
    });
    if (!profile) throw new Error('Candidate profile not found.');

    const aiResult = await AIService.calculateSkillGap(
      profile.skills.map((s) => ({
        name: s.name,
        category: s.category as 'CORE' | 'SAFETY' | 'TOOL' | 'DIAGNOSTIC' | 'SOFT',
        confidence: s.confidence,
        level: s.level as 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT',
      })),
      jobRoleId
    );

    // Delete old gaps and save new ones
    await prisma.skillGap.deleteMany({ where: { candidateProfileId } });

    await prisma.skillGap.createMany({
      data: aiResult.data.gaps.map((g) => ({
        candidateProfileId,
        skillName: g.skillName,
        currentLevelScore: g.currentLevelScore,
        requiredLevelScore: g.requiredLevelScore,
        status: g.status,
        bridgeModuleTitle: g.recommendedBridgeModule.title,
        bridgeModuleDuration: g.recommendedBridgeModule.duration,
        bridgeModulePartner: g.recommendedBridgeModule.partner,
        bridgeModuleLinkUrl: g.recommendedBridgeModule.linkUrl,
      })),
    });

    return prisma.skillGap.findMany({ where: { candidateProfileId } });
  }
}
