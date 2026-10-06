import prisma from '../config/database';
import { AIService } from './ai.service';

export class CertificationService {
  static async recommendCertification(candidateProfileId: string) {
    const profile = await prisma.candidateProfile.findUnique({
      where: { id: candidateProfileId },
      include: { selectedJobRole: true, skillScore: true },
    });
    if (!profile) throw new Error('Candidate profile not found.');

    const scores = {
      knowledge: profile.knowledgeScore,
      practical: profile.practicalScore,
      safety: profile.safetyScore,
      evidence: profile.evidenceScore,
      communication: profile.communicationScore,
    };

    const aiRec = await AIService.generateRecommendation({}, scores);
    const overallScore = AIService.calculateOverallScore(scores);

    return {
      candidateProfileId,
      overallScore,
      certificationEligible: aiRec.data.certificationEligible,
      readinessStatus: aiRec.data.readinessStatus,
      recommendedAction: aiRec.data.recommendedAction,
      recommendedJobRole: profile.selectedJobRole?.title || 'Trade Specialist',
      nsqfLevel: profile.nsqfTargetLevel,
      aiRecommendation: aiRec,
    };
  }

  static async getCertifications(candidateProfileId: string) {
    const certification = await prisma.certification.findUnique({
      where: { candidateProfileId },
      include: {
        candidateProfile: {
          include: {
            user: { select: { name: true, email: true, phone: true, location: true } },
          },
        },
      },
    });

    if (!certification) return null;
    return certification;
  }
}
