import prisma from '../config/database';
import { AIService } from './ai.service';
import { UpdateProfileInput } from '../validators/candidate.validator';

export class CandidateService {
  static async getProfile(userId: string) {
    const profile = await prisma.candidateProfile.findUnique({
      where: { userId },
      include: {
        user: { select: { name: true, email: true, phone: true, language: true, location: true } },
        skills: { orderBy: { confidence: 'desc' } },
        experiences: { orderBy: { createdAt: 'desc' } },
        evidences: { orderBy: { uploadedAt: 'desc' } },
        skillGaps: true,
        skillScore: true,
        certification: true,
        selectedJobRole: true,
      },
    });
    if (!profile) throw new Error('Candidate profile not found.');
    return profile;
  }

  static async updateProfile(userId: string, data: UpdateProfileInput) {
    const profile = await prisma.candidateProfile.findUnique({ where: { userId } });
    if (!profile) throw new Error('Candidate profile not found.');

    const updatedProfile = await prisma.candidateProfile.update({
      where: { userId },
      data: {
        ...(data.age !== undefined && { age: data.age }),
        ...(data.yearsOfExperience !== undefined && { yearsOfExperience: data.yearsOfExperience }),
        ...(data.primaryTrade && { primaryTrade: data.primaryTrade }),
        ...(data.nsqfTargetLevel !== undefined && { nsqfTargetLevel: data.nsqfTargetLevel }),
        ...(data.selectedJobRoleId && { selectedJobRoleId: data.selectedJobRoleId }),
        ...(data.experienceDescription && { experienceDescription: data.experienceDescription }),
      },
    });

    // Update completion percentage
    const fields = [
      updatedProfile.age,
      updatedProfile.yearsOfExperience,
      updatedProfile.primaryTrade,
      updatedProfile.experienceDescription,
      updatedProfile.selectedJobRoleId,
    ];
    const filled = fields.filter(Boolean).length;
    const completion = Math.min(100, Math.round((filled / fields.length) * 100));

    return prisma.candidateProfile.update({
      where: { userId },
      data: { profileCompletion: completion },
      include: { user: true, skills: true },
    });
  }

  static async getExperiences(userId: string) {
    const profile = await prisma.candidateProfile.findUnique({ where: { userId } });
    if (!profile) throw new Error('Candidate profile not found.');

    return prisma.experience.findMany({
      where: { candidateProfileId: profile.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async addExperience(
    userId: string,
    data: { description: string; yearsOfExperience: number; employer?: string; role?: string; location?: string }
  ) {
    const profile = await prisma.candidateProfile.findUnique({ where: { userId } });
    if (!profile) throw new Error('Candidate profile not found.');

    const experience = await prisma.experience.create({
      data: { candidateProfileId: profile.id, ...data },
    });

    // Update experience years on profile
    await prisma.candidateProfile.update({
      where: { id: profile.id },
      data: { yearsOfExperience: data.yearsOfExperience },
    });

    return experience;
  }

  static async analyzeExperience(userId: string, description: string) {
    const profile = await prisma.candidateProfile.findUnique({ where: { userId } });
    if (!profile) throw new Error('Candidate profile not found.');

    const aiResult = await AIService.analyzeExperience(description);
    const { extractedSkills } = aiResult.data;

    // Save skills to DB (replace existing)
    await prisma.skill.deleteMany({ where: { candidateProfileId: profile.id } });
    await prisma.skill.createMany({
      data: extractedSkills.map((s) => ({
        candidateProfileId: profile.id,
        name: s.name,
        category: s.category,
        confidence: s.confidence,
        level: s.level,
      })),
    });

    // Update profile with AI findings
    await prisma.candidateProfile.update({
      where: { id: profile.id },
      data: {
        experienceDescription: description,
        experienceConfidence: aiResult.data.experienceConfidence,
        yearsOfExperience: aiResult.data.yearsOfExperience,
        primaryTrade: aiResult.data.detectedTrade,
        nsqfTargetLevel: aiResult.data.recommendedNSQFLevel,
        assessmentStatus: 'PROFILING',
        profileCompletion: Math.min(100, profile.profileCompletion + 30),
      },
    });

    return aiResult;
  }
}
