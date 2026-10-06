import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const isProd = process.env.NODE_ENV === 'production';

function validateAndGetEnv(key: string, isSecret = false): string {
  const val = process.env[key];
  if (!val || val.trim() === '') {
    throw new Error(`[CRITICAL SECURITY CONFIG] Missing required environment variable: ${key}`);
  }

  // Reject insecure fallback values
  const insecureDefaults = ['secret', 'jwtsecret', '123456', 'password', 'changeme', 'admin'];
  if (isSecret && insecureDefaults.includes(val.toLowerCase().trim())) {
    throw new Error(
      `[CRITICAL SECURITY CONFIG] Insecure secret detected for ${key}. Hardcoded or weak secrets are prohibited.`
    );
  }

  if (isSecret && isProd && val.length < 32) {
    throw new Error(
      `[CRITICAL SECURITY CONFIG] ${key} must be at least 32 characters in production. Found length: ${val.length}`
    );
  }

  return val.trim();
}

const databaseUrl = validateAndGetEnv('DATABASE_URL');
const jwtAccessSecret = process.env.JWT_ACCESS_SECRET
  ? validateAndGetEnv('JWT_ACCESS_SECRET', true)
  : validateAndGetEnv('JWT_SECRET', true);

const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET
  ? validateAndGetEnv('JWT_REFRESH_SECRET', true)
  : jwtAccessSecret + '-refresh'; // safe deterministic derivation in dev if not set

const rawCors = process.env.ALLOWED_ORIGINS || process.env.CORS_ORIGIN || 'http://localhost:5173';
const allowedOrigins = rawCors
  .split(',')
  .map((origin) => origin.trim())
  .filter((origin) => origin.length > 0);

// Disallow wildcard origin with credentials
if (allowedOrigins.includes('*')) {
  throw new Error('[CRITICAL SECURITY CONFIG] Wildcard CORS origin "*" is prohibited with credentials.');
}

export const config = {
  databaseUrl,
  jwtAccessSecret,
  jwtRefreshSecret,
  jwtSecret: jwtAccessSecret, // backward-compat alias
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: allowedOrigins.length === 1 ? allowedOrigins[0] : allowedOrigins,
  allowedOrigins,
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
  uploadDir: process.env.UPLOAD_DIRECTORY || process.env.UPLOAD_DIR || 'uploads',
  maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10),
  isDev: process.env.NODE_ENV !== 'production',
  isProd,
};
