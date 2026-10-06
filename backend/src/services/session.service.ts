import { Request } from 'express';
import prisma from '../config/database';
import { generateSecureToken, hashToken } from '../utils/crypto';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { securityConfig } from '../config/security.config';
import { UserRole } from '../types';

export class SessionService {
  /**
   * Create a new session and corresponding hashed refresh token
   */
  static async createSession(userId: string, user: { email: string; role: string; name: string }, req: Request) {
    const rawRefreshToken = generateSecureToken(32);
    const tokenHash = hashToken(rawRefreshToken);

    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const ipAddress = typeof clientIp === 'string' ? clientIp.split(',')[0].trim() : String(clientIp);
    const userAgent = req.headers['user-agent'] ? req.headers['user-agent'].substring(0, 255) : 'unknown';

    const expiresAt = new Date(Date.now() + securityConfig.tokens.refreshLifetimeMs);

    const session = await prisma.session.create({
      data: {
        userId,
        tokenHash,
        ipAddress,
        userAgent,
        expiresAt,
      },
    });

    const accessToken = signAccessToken({
      userId,
      email: user.email,
      role: user.role as UserRole,
      name: user.name,
      sessionId: session.id,
    });

    const refreshToken = signRefreshToken({
      userId,
      sessionId: session.id,
    });

    return { session, accessToken, refreshToken, rawRefreshToken };
  }

  /**
   * Rotate refresh token with anti-replay / reuse detection (Requirement 2 & 26)
   */
  static async rotateSession(refreshToken: string, req: Request) {
    // 1. Verify cryptographic validity of JWT refresh token
    const payload = verifyRefreshToken(refreshToken);
    const { userId, sessionId } = payload;

    // 2. Fetch session inside transaction
    return prisma.$transaction(async (tx) => {
      const session = await tx.session.findUnique({
        where: { id: sessionId },
        include: { user: true },
      });

      if (!session) {
        throw new Error('Invalid or non-existent session.');
      }

      // Check for token reuse / revocation
      if (session.revokedAt) {
        // TOKEN REPLAY DETECTED: Compromised token detected! Revoke all sessions for this user.
        await tx.session.updateMany({
          where: { userId, revokedAt: null },
          data: { revokedAt: new Date() },
        });
        throw new Error('Compromised session token reuse detected. All sessions revoked.');
      }

      // Check expiration
      if (session.expiresAt < new Date()) {
        await tx.session.update({
          where: { id: sessionId },
          data: { revokedAt: new Date() },
        });
        throw new Error('Session has expired. Please login again.');
      }

      // Generate rotated token
      const newRawRefreshToken = generateSecureToken(32);
      const newTokenHash = hashToken(newRawRefreshToken);

      const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
      const ipAddress = typeof clientIp === 'string' ? clientIp.split(',')[0].trim() : String(clientIp);

      const newExpiresAt = new Date(Date.now() + securityConfig.tokens.refreshLifetimeMs);

      // Rotate session record
      const updatedSession = await tx.session.update({
        where: { id: sessionId },
        data: {
          tokenHash: newTokenHash,
          lastUsedAt: new Date(),
          expiresAt: newExpiresAt,
          ipAddress,
        },
      });

      const newAccessToken = signAccessToken({
        userId: session.user.id,
        email: session.user.email,
        role: session.user.role as UserRole,
        name: session.user.name,
        sessionId: updatedSession.id,
      });

      const newRefreshToken = signRefreshToken({
        userId: session.user.id,
        sessionId: updatedSession.id,
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: {
          id: session.user.id,
          email: session.user.email,
          role: session.user.role as UserRole,
          name: session.user.name,
        },
      };
    });
  }

  /**
   * Revoke current session (Logout)
   */
  static async revokeSession(sessionId: string): Promise<void> {
    if (!sessionId) return;
    await prisma.session.updateMany({
      where: { id: sessionId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  /**
   * Revoke all sessions for a user (Logout-All / Security Reset)
   */
  static async revokeAllUserSessions(userId: string): Promise<number> {
    const result = await prisma.session.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return result.count;
  }
}
