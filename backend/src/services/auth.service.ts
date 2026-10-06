import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/crypto';
import { signToken } from '../utils/jwt';
import { RegisterInput, LoginInput } from '../validators/auth.validator';
import { UserRole } from '../types';

export class AuthService {
  static async register(data: RegisterInput) {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email: data.email }, { phone: data.phone }] },
    });
    if (existing) {
      throw new Error(existing.email === data.email ? 'Email already registered.' : 'Phone already registered.');
    }

    const passwordHash = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        phone: data.phone,
        passwordHash,
        name: data.name,
        role: 'CANDIDATE',
        language: data.language || 'en',
        location: data.location,
        candidateProfile: {
          create: {
            yearsOfExperience: data.yearsOfExperience,
            primaryTrade: data.primaryTrade,
            profileCompletion: 20,
            assessmentStatus: 'NOT_STARTED',
          },
        },
      },
      include: { candidateProfile: true },
    });

    const token = signToken({ userId: user.id, email: user.email, role: user.role as UserRole, name: user.name });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role as UserRole,
        language: user.language,
        location: user.location,
      },
      token,
      candidateProfile: user.candidateProfile,
    };
  }

  static async login(data: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: data.email }, include: { candidateProfile: true } });
    if (!user) throw new Error('Invalid email or password.');

    const valid = await comparePassword(data.password, user.passwordHash);
    if (!valid) throw new Error('Invalid email or password.');

    const token = signToken({ userId: user.id, email: user.email, role: user.role as UserRole, name: user.name });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role as UserRole,
        language: user.language,
        location: user.location,
      },
      token,
      candidateProfile: user.candidateProfile,
    };
  }

  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { candidateProfile: { include: { skills: true, certification: true } } },
    });
    if (!user) throw new Error('User not found.');

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role as UserRole,
      language: user.language,
      location: user.location,
      avatarUrl: user.avatarUrl,
      candidateProfile: user.candidateProfile,
    };
  }
}
