import prisma from '../config/database';

export class JobRoleService {
  static async getAllJobRoles() {
    return prisma.jobRole.findMany({
      include: { _count: { select: { questions: true, assessments: true } } },
      orderBy: { certifiedCandidatesCount: 'desc' },
    });
  }

  static async getJobRoleById(id: string) {
    const role = await prisma.jobRole.findUnique({
      where: { id },
      include: {
        questions: { orderBy: { difficultyLevel: 'asc' } },
        _count: { select: { questions: true, assessments: true } },
      },
    });
    if (!role) throw new Error('Job role not found.');
    return role;
  }
}
