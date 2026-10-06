import prisma from '../config/database';
import { paginateQuery, buildPaginationMeta } from '../utils/response';

export class AdminService {
  static async getDashboardStats() {
    const [
      totalCandidates,
      totalAssessors,
      totalAssessments,
      totalCertifications,
      certifiedProfiles,
      allProfiles,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'CANDIDATE' } }),
      prisma.user.count({ where: { role: 'ASSESSOR' } }),
      prisma.assessment.count(),
      prisma.certification.count({ where: { isValid: true } }),
      prisma.candidateProfile.findMany({ where: { assessmentStatus: 'CERTIFIED' }, select: { overallScore: true } }),
      prisma.candidateProfile.findMany({ select: { overallScore: true } }),
    ]);

    const avgScore =
      allProfiles.length > 0
        ? Math.round(allProfiles.reduce((sum, p) => sum + p.overallScore, 0) / allProfiles.length)
        : 0;

    const passRate =
      allProfiles.length > 0 ? Math.round((certifiedProfiles.length / allProfiles.length) * 100) : 0;

    return {
      totalCandidates,
      totalAssessors,
      totalAssessments,
      totalCertifications,
      avgScore,
      passRate,
      pendingReviews: await prisma.candidateProfile.count({
        where: { assessmentStatus: 'UNDER_ASSESSOR_REVIEW' },
      }),
    };
  }

  static async getAllCandidates(page: number, limit: number, filters: Record<string, string> = {}) {
    const { skip, take } = paginateQuery(page, limit);

    const where: Record<string, unknown> = {};
    if (filters.trade) where.primaryTrade = { contains: filters.trade, mode: 'insensitive' };
    if (filters.status) where.assessmentStatus = filters.status;

    const [candidates, total] = await Promise.all([
      prisma.candidateProfile.findMany({
        where,
        skip,
        take,
        include: {
          user: { select: { name: true, email: true, phone: true, location: true } },
          certification: { select: { certificateId: true, issuedAt: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.candidateProfile.count({ where }),
    ]);

    return { candidates, meta: buildPaginationMeta(total, page, limit) };
  }

  static async getAllAssessments(page: number, limit: number) {
    const { skip, take } = paginateQuery(page, limit);

    const [assessments, total] = await Promise.all([
      prisma.assessment.findMany({
        skip,
        take,
        include: {
          jobRole: { select: { title: true } },
          candidateProfile: {
            include: { user: { select: { name: true } } },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.assessment.count(),
    ]);

    return { assessments, meta: buildPaginationMeta(total, page, limit) };
  }

  static async getAnalytics() {
    const tradeDistribution = await prisma.candidateProfile.groupBy({
      by: ['primaryTrade'],
      _count: { primaryTrade: true },
      orderBy: { _count: { primaryTrade: 'desc' } },
      take: 10,
    });

    const statusDistribution = await prisma.candidateProfile.groupBy({
      by: ['assessmentStatus'],
      _count: { assessmentStatus: true },
    });

    const recentCertifications = await prisma.certification.findMany({
      where: { isValid: true },
      include: {
        candidateProfile: {
          include: { user: { select: { name: true, location: true } } },
        },
      },
      orderBy: { issuedAt: 'desc' },
      take: 10,
    });

    const auditLogs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return {
      tradeDistribution: tradeDistribution.map((t) => ({
        trade: t.primaryTrade,
        count: t._count.primaryTrade,
      })),
      statusDistribution: statusDistribution.map((s) => ({
        status: s.assessmentStatus,
        count: s._count.assessmentStatus,
      })),
      recentCertifications,
      auditLogs,
    };
  }
}
