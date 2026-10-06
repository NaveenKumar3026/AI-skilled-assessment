import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';

import { config } from './config/env';
import { securityConfig } from './config/security.config';
import { errorHandler } from './middleware/error.middleware';
import { requestLogger } from './middleware/requestLogger.middleware';
import { generalLimiter } from './middleware/rateLimit.middleware';
import { csrfProtection } from './middleware/csrf.middleware';
import prisma from './config/database';

// Routes
import authRoutes from './routes/auth.routes';
import candidateRoutes from './routes/candidate.routes';
import experienceRoutes from './routes/experience.routes';
import skillsRoutes from './routes/skills.routes';
import jobRoleRoutes from './routes/jobRole.routes';
import assessmentRoutes from './routes/assessment.routes';
import practicalRoutes from './routes/practical.routes';
import evidenceRoutes from './routes/evidence.routes';
import resultsRoutes from './routes/results.routes';
import skillGapsRoutes from './routes/skillGaps.routes';
import assessorRoutes from './routes/assessor.routes';
import certificationRoutes from './routes/certification.routes';
import adminRoutes from './routes/admin.routes';

const app = express();

// ─── Ensure upload directory exists outside web root ──────────────────────────
const uploadDir = path.resolve(config.uploadDir);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ─── Security Headers (Requirement 10) ────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: securityConfig.csp.directives,
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'same-site' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    hsts: config.isProd
      ? {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: true,
        }
      : false,
  })
);

// ─── Strict CORS Configuration (Requirement 11) ──────────────────────────────
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server or tools without origin header (like curl or postman in dev)
      if (!origin) return callback(null, true);
      if (config.allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'X-XSRF-Token', 'X-Request-ID'],
    exposedHeaders: ['X-Request-ID'],
  })
);

// ─── Cookie Parser (Requirement 2 & 3) ────────────────────────────────────────
app.use(cookieParser());

// ─── Request Correlation & Structured Logging (Requirement 17) ────────────────
app.use(requestLogger);

// ─── Request Size Limits (Requirement 7: Strict 1MB max) ──────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ─── Rate Limiting (Requirement 8) ────────────────────────────────────────────
app.use(generalLimiter);

// ─── CSRF Protection (Requirement 12) ─────────────────────────────────────────
app.use(csrfProtection);

// ─── Security Health Check (Requirement 35: Zero Sensitive Info Leaks) ────────
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'SkillSet AI API',
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/job-roles', jobRoleRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/practical', practicalRoutes);
app.use('/api/evidence', evidenceRoutes);
app.use('/api/results', resultsRoutes);
app.use('/api/skill-gaps', skillGapsRoutes);
app.use('/api/assessor', assessorRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/admin', adminRoutes);

// ─── 404 Handler (Requirement 31: Consistent Shape) ───────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Requested route not found.',
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: 'The requested API endpoint does not exist.',
    },
  });
});

// ─── Centralized Error Handler (MUST be last) (Requirement 16) ────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const server = app.listen(config.port, () => {
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║         SkillSet AI — Backend Server              ║');
  console.log('║            (Security Hardened Edition)            ║');
  console.log('╚═══════════════════════════════════════════════════╝');
  console.log(`  🚀 Server running at  : http://localhost:${config.port}`);
  console.log(`  📊 Health check       : http://localhost:${config.port}/api/health`);
  console.log(`  🌍 Environment        : ${config.nodeEnv}`);
  console.log(`  🔒 CORS allowed       : ${config.allowedOrigins.join(', ')}`);
  console.log(`  🛡️ Auth Engine        : Argon2id + Refresh Token Rotation`);
  console.log('');
});

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
const shutdown = async (signal: string) => {
  console.log(`\n[${signal}] Shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    console.log('✅ Database disconnected. Server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export default app;
