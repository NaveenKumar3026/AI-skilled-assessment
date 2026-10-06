/**
 * Sensitive Data Filtering & DTO Sanitization
 * Ensures internal credentials, password hashes, and security tokens are NEVER leaked in API responses.
 */

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  language: string;
  location: string;
  avatarUrl?: string | null;
  createdAt?: Date;
}

export interface PublicCertificateVerification {
  isValid: boolean;
  verificationId: string;
  certificateId: string;
  jobRoleTitle: string;
  nsqfLevel: number;
  candidateName: string;
  issuedAt: Date;
  expiresAt: Date | null;
}

/**
 * Filter out sensitive fields from User objects.
 */
export function sanitizeUser(user: any): SafeUser {
  if (!user) return user;
  const {
    passwordHash: _ph,
    tokenHash: _th,
    refreshTokenHash: _rth,
    sessions: _sessions,
    ...safeUser
  } = user;

  return {
    id: safeUser.id,
    name: safeUser.name,
    email: safeUser.email,
    phone: safeUser.phone,
    role: safeUser.role,
    language: safeUser.language || 'en',
    location: safeUser.location || '',
    avatarUrl: safeUser.avatarUrl || null,
    createdAt: safeUser.createdAt,
  };
}

/**
 * Deeply sanitize any object or array to recursively strip sensitive keys.
 */
export function sanitizeData<T>(data: T): T {
  if (data === null || data === undefined) return data;
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeData(item)) as unknown as T;
  }
  if (typeof data === 'object') {
    const sensitiveKeys = new Set([
      'passwordHash',
      'tokenHash',
      'refreshTokenHash',
      'password',
      'secret',
      'jwtSecret',
    ]);
    const result: Record<string, any> = {};
    for (const [key, val] of Object.entries(data)) {
      if (!sensitiveKeys.has(key)) {
        result[key] = sanitizeData(val);
      }
    }
    return result as T;
  }
  return data;
}
