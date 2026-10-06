import { Request } from 'express';
import prisma from '../config/database';
import { hashPassword, verifyPassword } from '../utils/crypto';
import { RegisterInput, LoginInput } from '../validators/auth.validator';
import { UserRole } from '../types';
import { sanitizeUser } from '../utils/sanitize';
import { SessionService } from './session.service';
import { BruteForceService } from './bruteForce.service';
import { logAuditEvent } from '../middleware/audit.middleware';

export class AuthService {
  static async register(data: RegisterInput, req: Request) {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email: data.email }, { phone: data.phone }] },
    });
    if (existing) {
      throw new Error(existing.email === data.email ? 'Email already registered.' : 'Phone already registered.');
    }

    // Hash password with Argon2id
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

    // Create session and access/refresh token pair
    const sessionData = await SessionService.createSession(
      user.id,
      { email: user.email, role: user.role, name: user.name },
      req
    );

    await logAuditEvent({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: 'USER_REGISTERED',
      resourceType: 'User',
      resourceId: user.id,
      requestId: req.requestId,
      details: `Candidate self-registered: ${user.email}`,
    });

    return {
      user: sanitizeUser(user),
      token: sessionData.accessToken,
      refreshToken: sessionData.refreshToken,
      candidateProfile: user.candidateProfile,
    };
  }

  static async login(data: LoginInput, req: Request) {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const ip = typeof clientIp === 'string' ? clientIp.split(',')[0].trim() : String(clientIp);

    // 1. Check account / IP lockout
    const lockCheck = BruteForceService.isLocked(ip, data.email);
    if (lockCheck.locked) {
      throw new Error(
        `Too many login attempts. Account temporarily throttled for security. Please try again in ${lockCheck.retryAfterSeconds} seconds.`
      );
    }

    // 2. Fetch user
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: { candidateProfile: true },
    });

    // Generic error: never reveal if email exists
    if (!user) {
      await BruteForceService.recordFailure(ip, data.email);
      await logAuditEvent({
        action: 'LOGIN_FAILURE',
        requestId: req.requestId,
        details: `Failed login attempt for unknown email: ${data.email} from ${ip}`,
      });
      throw new Error('Invalid credentials.');
    }

    // 3. Verify password (Argon2id or Bcrypt backward migration)
    const verification = await verifyPassword(data.password, user.passwordHash);
    if (!verification.isValid) {
      await BruteForceService.recordFailure(ip, data.email);
      await logAuditEvent({
        actorId: user.id,
        actorName: user.name,
        actorRole: user.role,
        action: 'LOGIN_FAILURE',
        resourceType: 'User',
        resourceId: user.id,
        requestId: req.requestId,
        details: `Invalid password attempt for: ${user.email} from ${ip}`,
      });
      throw new Error('Invalid credentials.');
    }

    // Reset brute force counter on successful password match
    BruteForceService.recordSuccess(ip, data.email);

    // Seamless migration: upgrade bcrypt hash to Argon2id if needed
    if (verification.needsRehash) {
      try {
        const upgradedHash = await hashPassword(data.password);
        await prisma.user.update({
          where: { id: user.id },
          data: { passwordHash: upgradedHash },
        });
        console.log(`[AUTH] Successfully migrated password hash to Argon2id for user ${user.id}`);
      } catch (err) {
        console.error('[AUTH] Failed to upgrade password hash to Argon2id:', err);
      }
    }

    // 4. Create Session and tokens
    const sessionData = await SessionService.createSession(
      user.id,
      { email: user.email, role: user.role, name: user.name },
      req
    );

    await logAuditEvent({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: 'LOGIN_SUCCESS',
      resourceType: 'User',
      resourceId: user.id,
      requestId: req.requestId,
      details: `Successful login for: ${user.email}`,
    });

    return {
      user: sanitizeUser(user),
      token: sessionData.accessToken,
      refreshToken: sessionData.refreshToken,
      candidateProfile: user.candidateProfile,
    };
  }

  static async refresh(refreshToken: string, req: Request) {
    return SessionService.rotateSession(refreshToken, req);
  }

  static async logout(sessionId?: string, userId?: string, req?: Request) {
    if (sessionId) {
      await SessionService.revokeSession(sessionId);
    }
    if (userId) {
      await logAuditEvent({
        actorId: userId,
        action: 'LOGOUT',
        resourceType: 'Session',
        resourceId: sessionId,
        requestId: req?.requestId,
        details: `User logged out session ${sessionId}`,
      });
    }
  }

  static async logoutAll(userId: string, req?: Request) {
    const revokedCount = await SessionService.revokeAllUserSessions(userId);
    await logAuditEvent({
      actorId: userId,
      action: 'LOGOUT_ALL',
      resourceType: 'Session',
      requestId: req?.requestId,
      details: `Revoked all ${revokedCount} sessions for user`,
    });
    return { revokedCount };
  }

  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { candidateProfile: { include: { skills: true, certification: true } } },
    });
    if (!user) throw new Error('User not found.');

    const safeUser = sanitizeUser(user);

    return {
      ...safeUser,
      candidateProfile: user.candidateProfile,
    };
  }
}
