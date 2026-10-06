/**
 * SkillSet AI - Centralized Security Configuration
 * 
 * Defines all security boundaries, cryptographic lifetimes, rate limiting quotas,
 * file validation policies, and session parameters in one authoritative location.
 */

export const securityConfig = {
  // ─── Token & Session Lifetimes ─────────────────────────────────────────────
  tokens: {
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    refreshLifetimeMs: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    cookieAccessName: 'skillset_access_token',
    cookieRefreshName: 'skillset_refresh_token',
    cookieCsrfName: 'XSRF-TOKEN',
  },

  // ─── Cookie Security Settings ──────────────────────────────────────────────
  cookies: {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  },

  // ─── Rate Limiting Policies ────────────────────────────────────────────────
  rateLimits: {
    general: {
      windowMs: 60 * 1000, // 1 minute
      max: 100, // 100 req/min per IP
      message: 'Too many requests. Please slow down and try again later.',
    },
    login: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // 5 attempts per window per IP/email
      message: 'Too many login attempts. Account temporarily throttled for security.',
    },
    register: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 10,
      message: 'Too many registration requests. Please try again later.',
    },
    aiAnalysis: {
      windowMs: 60 * 1000, // 1 minute
      max: 20, // 20 AI queries per minute per user
      message: 'AI analysis quota exceeded. Please wait a moment before requesting more evaluations.',
    },
    assessmentSubmit: {
      windowMs: 60 * 1000, // 1 minute
      max: 15,
      message: 'Assessment submission rate limit reached. Please wait.',
    },
    fileUpload: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 10, // 10 uploads per window
      message: 'File upload rate limit reached. Please wait before uploading more evidence.',
    },
  },

  // ─── File Upload Validation & Restrictions ──────────────────────────────────
  uploads: {
    maxSizeBytes: 10 * 1024 * 1024, // 10 MB
    allowedExtensions: ['.pdf', '.jpg', '.jpeg', '.png', '.webp', '.mp4'],
    allowedMimeTypes: [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
      'video/mp4',
    ],
    // Magic byte signatures for deep content inspection
    magicBytes: {
      pdf: [0x25, 0x50, 0x44, 0x46], // %PDF
      jpeg: [0xff, 0xd8, 0xff],       // JPEG SOI marker
      png: [0x89, 0x50, 0x4e, 0x47], // PNG header
      webp: [0x52, 0x49, 0x46, 0x46], // RIFF (check WEBP at byte 8)
      mp4: [0x66, 0x74, 0x79, 0x70],  // ftyp box (bytes 4-8)
    },
  },

  // ─── Password Security Policy ──────────────────────────────────────────────
  passwords: {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecial: true,
    // Disallow common weak passwords
    blacklisted: [
      'password',
      'password123',
      '12345678',
      'qwerty123',
      'admin123',
      'skillset123',
    ],
  },

  // ─── Pagination Limits ─────────────────────────────────────────────────────
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },

  // ─── Content Security Policy Configuration ──────────────────────────────────
  csp: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
      imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
      mediaSrc: ["'self'", 'blob:', 'data:'],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  },
};
