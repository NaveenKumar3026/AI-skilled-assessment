import prisma from '../config/database';
import { AIService } from './ai.service';
import { GapStatus } from '../types';

export class ResultsService {
  static async getAssessmentResults(assessmentId: string) {
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        jobRole: true,
        responses: { include: { question: true } },
        candidateProfile: {
          include: {
            user: { select: { name: true } },
            skillScore: true,
            skillGaps: true,
          },
        },
        assessorReview: true,
      },
    });
    if (!assessment) throw new Error('Assessment not found.');

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

  static async getSkillGaps(candidateProfileId: string) {
    const gaps = await prisma.skillGap.findMany({
      where: { candidateProfileId },
      orderBy: { status: 'asc' },
    });

    if (gaps.length === 0) {
      // Generate from AI if not yet in DB
      const profile = await prisma.candidateProfile.findUnique({
        where: { id: candidateProfileId },
        include: { skills: true },
      });
      if (!profile) throw new Error('Candidate profile not found.');

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
