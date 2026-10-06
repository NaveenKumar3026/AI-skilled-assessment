import prisma from '../config/database';
import { AIService } from './ai.service';
import { EvidenceType } from '../types';

export class EvidenceService {
  static async uploadEvidence(
    userId: string,
    data: { fileName: string; fileType: string; fileSize: string; filePath: string }
  ) {
    const profile = await prisma.candidateProfile.findUnique({ where: { userId } });
    if (!profile) throw new Error('Candidate profile not found.');

    const evidence = await prisma.evidence.create({
      data: {
        candidateProfileId: profile.id,
        fileName: data.fileName,
        fileType: data.fileType,
        fileSize: data.fileSize,
        filePath: data.filePath,
        aiVerificationStatus: 'PENDING',
      },
    });

    const aiResult = await AIService.analyzeEvidence(data.fileName, data.fileType, data.filePath);

    const updatedEvidence = await prisma.evidence.update({
      where: { id: evidence.id },
      data: {
        aiVerificationStatus: aiResult.data.verificationStatus,
        aiRelevanceScore: aiResult.data.relevanceScore,
        extractedData: JSON.stringify(aiResult.data.extractedData),
        aiConfidence: aiResult.confidence,
        requiresHumanValidation: true,
      },
    });

    const allEvidence = await prisma.evidence.findMany({ where: { candidateProfileId: profile.id } });
    const avgScore = allEvidence.reduce((sum, e) => sum + e.aiRelevanceScore, 0) / allEvidence.length;

    await prisma.candidateProfile.update({
      where: { id: profile.id },
      data: {
        evidenceScore: Math.round(avgScore),
        assessmentStatus: 'EVIDENCE_UPLOADED',
      },
    });

    return { evidence: updatedEvidence, aiResult };
  }

  static async getEvidence(userId: string) {
    const profile = await prisma.candidateProfile.findUnique({ where: { userId } });
    if (!profile) throw new Error('Candidate profile not found.');

    return prisma.evidence.findMany({
      where: { candidateProfileId: profile.id },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  static async analyzeEvidence(evidenceId: string, _userId: string) {
    const evidence = await prisma.evidence.findUnique({ where: { id: evidenceId } });
    if (!evidence) throw new Error('Evidence not found.');

    const aiResult = await AIService.analyzeEvidence(evidence.fileName, evidence.fileType, evidence.filePath);

    const updated = await prisma.evidence.update({
      where: { id: evidenceId },
      data: {
        aiVerificationStatus: aiResult.data.verificationStatus,
        aiRelevanceScore: aiResult.data.relevanceScore,
        extractedData: JSON.stringify(aiResult.data.extractedData),
        aiConfidence: aiResult.confidence,
      },
    });

    return { evidence: updated, aiResult };
  }
}
