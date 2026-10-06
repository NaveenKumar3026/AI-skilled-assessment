import prisma from '../config/database';

export class SkillsService {
  static async getSkillProfile(userId: string) {
    const profile = await prisma.candidateProfile.findUnique({
      where: { userId },
      include: { skills: { orderBy: { confidence: 'desc' } }, skillScore: true },
    });
    if (!profile) throw new Error('Candidate profile not found.');

    const skillsByCategory = {
      CORE: profile.skills.filter((s) => s.category === 'CORE'),
      SAFETY: profile.skills.filter((s) => s.category === 'SAFETY'),
      TOOL: profile.skills.filter((s) => s.category === 'TOOL'),
      DIAGNOSTIC: profile.skills.filter((s) => s.category === 'DIAGNOSTIC'),
      SOFT: profile.skills.filter((s) => s.category === 'SOFT'),
    };

    return {
      skills: profile.skills,
      skillsByCategory,
      skillScore: profile.skillScore,
      totalSkills: profile.skills.length,
      verifiedSkills: profile.skills.filter((s) => s.verifiedByAssessor).length,
      averageConfidence:
        profile.skills.length > 0
          ? Math.round(profile.skills.reduce((sum, s) => sum + s.confidence, 0) / profile.skills.length)
          : 0,
    };
  }

  static async getRecommendations(userId: string) {
    const profile = await prisma.candidateProfile.findUnique({
      where: { userId },
      include: { skills: true },
    });
    if (!profile) throw new Error('Candidate profile not found.');

    const jobRoles = await prisma.jobRole.findMany();

    const recommendations = jobRoles.map((role) => {
      let requiredSkillsList: string[] = [];
      try {
        requiredSkillsList = JSON.parse(role.requiredSkills) as string[];
      } catch {
        requiredSkillsList = [];
      }

      const candidateSkillNames = profile.skills.map((s) => s.name.toLowerCase());
      const matchingSkills = requiredSkillsList.filter((req: string) =>
        candidateSkillNames.some((cs) => cs.includes(req.toLowerCase().split(' ')[0]))
      );
      const matchScore = Math.min(100, 50 + matchingSkills.length * 10 + (profile.yearsOfExperience > 5 ? 15 : 0));

      return { ...role, requiredSkills: requiredSkillsList, matchScore };
    });

    return recommendations.sort((a, b) => b.matchScore - a.matchScore);
  }

  static async updateSkills(
    userId: string,
    skills: { name: string; category: string; confidence: number; level: string }[]
  ) {
    const profile = await prisma.candidateProfile.findUnique({ where: { userId } });
    if (!profile) throw new Error('Candidate profile not found.');

    await prisma.skill.deleteMany({ where: { candidateProfileId: profile.id } });
    return prisma.skill.createMany({
      data: skills.map((s) => ({
        candidateProfileId: profile.id,
        name: s.name,
        category: s.category,
        confidence: s.confidence,
        level: s.level,
      })),
    });
  }
}
