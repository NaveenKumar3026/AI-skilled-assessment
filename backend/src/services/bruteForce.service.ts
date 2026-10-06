/**
 * Brute Force & Account Lockout Defense Service
 * 
 * Tracks failed authentication attempts per identifier (IP + account),
 * introduces progressive backoff delays to thwart automated attacks,
 * and enforces temporary lockouts without revealing user existence.
 */

interface AttemptRecord {
  count: number;
  firstAttemptAt: number;
  lastAttemptAt: number;
  lockedUntil?: number;
}

export class BruteForceService {
  private static store = new Map<string, AttemptRecord>();
  private static readonly MAX_ATTEMPTS = 5;
  private static readonly WINDOW_MS = 15 * 60 * 1000; // 15 minutes
  private static readonly LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

  private static makeKey(ip: string, identifier: string): string {
    return `${ip.toLowerCase().trim()}:${identifier.toLowerCase().trim()}`;
  }

  /**
   * Check if account / IP is currently throttled
   */
  static isLocked(ip: string, identifier: string): { locked: boolean; retryAfterSeconds: number } {
    const key = this.makeKey(ip, identifier);
    const record = this.store.get(key);
    if (!record) return { locked: false, retryAfterSeconds: 0 };

    const now = Date.now();
    if (record.lockedUntil && record.lockedUntil > now) {
      const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
      return { locked: true, retryAfterSeconds: remainingSeconds };
    }

    // Expire window
    if (now - record.firstAttemptAt > this.WINDOW_MS) {
      this.store.delete(key);
      return { locked: false, retryAfterSeconds: 0 };
    }

    return { locked: false, retryAfterSeconds: 0 };
  }

  /**
   * Record a failed attempt, apply progressive delay and trigger lockout if limit reached
   */
  static async recordFailure(ip: string, identifier: string): Promise<void> {
    const key = this.makeKey(ip, identifier);
    const now = Date.now();
    const record = this.store.get(key) || {
      count: 0,
      firstAttemptAt: now,
      lastAttemptAt: now,
    };

    if (now - record.firstAttemptAt > this.WINDOW_MS) {
      record.count = 1;
      record.firstAttemptAt = now;
      delete record.lockedUntil;
    } else {
      record.count += 1;
    }

    record.lastAttemptAt = now;

    if (record.count >= this.MAX_ATTEMPTS) {
      record.lockedUntil = now + this.LOCKOUT_DURATION_MS;
    }

    this.store.set(key, record);

    // Progressive delay mitigation: 200ms per failed attempt up to 1.5s
    const delayMs = Math.min(1500, record.count * 200);
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  /**
   * Reset attempts on successful authentication
   */
  static recordSuccess(ip: string, identifier: string): void {
    const key = this.makeKey(ip, identifier);
    this.store.delete(key);
  }

  /**
   * Clean up stale in-memory records periodically
   */
  static cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.store.entries()) {
      if (now - record.lastAttemptAt > this.WINDOW_MS * 2 && (!record.lockedUntil || record.lockedUntil < now)) {
        this.store.delete(key);
      }
    }
  }
}

// Clean up every 30 minutes
setInterval(() => BruteForceService.cleanup(), 30 * 60 * 1000);
