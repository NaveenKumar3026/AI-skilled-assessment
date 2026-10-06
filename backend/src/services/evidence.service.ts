import fs from 'fs';
import path from 'path';
import prisma from '../config/database';
import { AIService } from './ai.service';
import { AuthUser } from '../types';
import { logAuditEvent } from '../middleware/audit.middleware';

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

    await logAuditEvent({
      actorId: userId,
      action: 'EVIDENCE_UPLOADED',
      resourceType: 'Evidence',
      resourceId: updatedEvidence.id,
      details: `Uploaded evidence type ${data.fileType}: ${data.fileName}`,
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

  /**
   * Object-Level Authorization: Prevent IDOR (Requirement 5)
   */
  static async analyzeEvidence(evidenceId: string, user: AuthUser) {
    const evidence = await prisma.evidence.findUnique({
      where: { id: evidenceId },
      include: { candidateProfile: true },
    });
    if (!evidence) throw new Error('Evidence not found.');

    // IDOR check: Candidates can only trigger analysis on their own evidence
    if (user.role === 'CANDIDATE' && evidence.candidateProfile.userId !== user.id) {
      throw new Error('Access denied: You do not own this evidence document.');
    }

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

  /**
   * Secure Authorized File Download (Requirement 21)
   */
  static async getEvidenceForDownload(evidenceId: string, user: AuthUser) {
    const evidence = await prisma.evidence.findUnique({
      where: { id: evidenceId },
      include: { candidateProfile: true },
    });
    if (!evidence) throw new Error('Evidence not found.');

    // IDOR Access verification
    if (user.role === 'CANDIDATE' && evidence.candidateProfile.userId !== user.id) {
      throw new Error('Access denied: You do not have permission to download this evidence document.');
    }

    const resolvedPath = path.resolve(evidence.filePath);
    if (!fs.existsSync(resolvedPath)) {
      throw new Error('Requested evidence file no longer exists on server.');
    }

    return {
      filePath: resolvedPath,
      fileName: evidence.fileName,
      fileType: evidence.fileType,
    };
  }
}
