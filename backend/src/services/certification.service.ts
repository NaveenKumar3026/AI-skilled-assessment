import prisma from '../config/database';
import { AIService } from './ai.service';
import { AuthUser } from '../types';
import { PublicCertificateVerification } from '../utils/sanitize';

export class CertificationService {
  /**
   * Recommend certification (AI recommendation only; Human Assessor required for approval)
   */
  static async recommendCertification(candidateProfileId: string, user: AuthUser) {
    const profile = await prisma.candidateProfile.findUnique({
      where: { id: candidateProfileId },
      include: { selectedJobRole: true, skillScore: true },
    });
    if (!profile) throw new Error('Candidate profile not found.');

    // IDOR check: Candidates can only request recommendation for their own profile
    if (user.role === 'CANDIDATE' && profile.userId !== user.id) {
      throw new Error('Access denied: You cannot view recommendations for another candidate.');
    }

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

  /**
   * Authorized retrieval of private certification details
   */
  static async getCertifications(candidateProfileId: string, user: AuthUser) {
    const certification = await prisma.certification.findUnique({
      where: { candidateProfileId },
      include: {
        candidateProfile: {
          include: {
            user: { select: { id: true, name: true, email: true, phone: true, location: true } },
          },
        },
      },
    });

    if (!certification) return null;

    // IDOR Protection: Candidate can only view their own certificate
    if (user.role === 'CANDIDATE' && certification.candidateProfile.user.id !== user.id) {
      throw new Error('Access denied: You are not authorized to view this certificate.');
    }

    return certification;
  }

  /**
   * Public Certificate Verification (Requirement 27)
   * Strictly returns non-sensitive verification data. No phone/email/personal privacy leaks.
   */
  static async verifyCertificate(verificationId: string): Promise<PublicCertificateVerification> {
    const cert = await prisma.certification.findFirst({
      where: {
        OR: [
          { verificationId },
          { certificateId: verificationId },
        ],
      },
      include: {
        candidateProfile: {
          include: {
            user: { select: { name: true } },
          },
        },
      },
    });

    if (!cert) {
      throw new Error('No valid certification record exists with this verification identifier.');
    }

    return {
      isValid: cert.isValid,
      verificationId: cert.verificationId,
      certificateId: cert.certificateId,
      jobRoleTitle: cert.jobRoleTitle,
      nsqfLevel: cert.nsqfLevel,
      candidateName: cert.candidateProfile.user.name,
      issuedAt: cert.issuedAt,
      expiresAt: cert.expiresAt,
    };
  }
}
