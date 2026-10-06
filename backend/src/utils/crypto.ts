import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { argon2id, argon2Verify } from 'hash-wasm';

/**
 * Hash a plaintext password using Argon2id (OWASP recommended password hashing algorithm).
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16);
  return argon2id({
    password,
    salt,
    parallelism: 1,
    iterations: 3,
    memorySize: 65536, // 64 MB memory cost
    hashLength: 32,
    outputType: 'encoded',
  });
}

/**
 * Compare password against a hash with seamless backward compatibility:
 * - If hash is Argon2id ($argon2id$), verifies using Argon2id.
 * - If hash is legacy bcrypt ($2a$, $2b$, $2y$), verifies using bcrypt and signals needsRehash = true.
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<{ isValid: boolean; needsRehash: boolean }> {
  if (!storedHash || !password) {
    return { isValid: false, needsRehash: false };
  }

  // Handle Argon2id hashes
  if (storedHash.startsWith('$argon2')) {
    try {
      const isValid = await argon2Verify({ password, hash: storedHash });
      return { isValid, needsRehash: false };
    } catch {
      return { isValid: false, needsRehash: false };
    }
  }

  // Handle legacy bcrypt hashes ($2a$, $2b$, $2y$)
  if (storedHash.startsWith('$2')) {
    try {
      const isValid = await bcrypt.compare(password, storedHash);
      return { isValid, needsRehash: isValid };
    } catch {
      return { isValid: false, needsRehash: false };
    }
  }

  return { isValid: false, needsRehash: false };
}

// Backward-compatible alias for existing code
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  const result = await verifyPassword(password, hash);
  return result.isValid;
}

/**
 * Compute SHA-256 hash of high-entropy tokens (refresh tokens, session tokens).
 * Never store raw tokens in the database.
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Generate cryptographically secure random token string.
 */
export function generateSecureToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}

/**
 * Generate cryptographically random Certificate Verification ID.
 * Format: RPL-XXXX-XXXX-XXXX (e.g. RPL-7F4K-92MX-X8P2)
 */
export function generateVerificationId(): string {
  const charset = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // excludes 0, 1, I, O for readability
  const generateChunk = (len: number) => {
    const bytes = crypto.randomBytes(len);
    let result = '';
    for (let i = 0; i < len; i++) {
      result += charset[bytes[i] % charset.length];
    }
    return result;
  };

  return `RPL-${generateChunk(4)}-${generateChunk(4)}-${generateChunk(4)}`;
}
