import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';

import { config } from './config/env';
import { errorHandler } from './middleware/error.middleware';
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

// ─── Ensure upload directory exists ──────────────────────────────────────────
const uploadDir = path.resolve(config.uploadDir);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ─── Security Middleware ──────────────────────────────────────────────────────
app.use(helmet());

app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── Rate Limiting ────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});
app.use(limiter);

// Stricter limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many auth attempts. Please try again later.' },
});

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Static Files (uploads) ───────────────────────────────────────────────────
app.use('/uploads', express.static(uploadDir));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'SkillSet AI API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes);
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

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// ─── Centralized Error Handler (MUST be last) ─────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const server = app.listen(config.port, () => {
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║         SkillSet AI — Backend Server              ║');
  console.log('╚═══════════════════════════════════════════════════╝');
  console.log(`  🚀 Server running at  : http://localhost:${config.port}`);
  console.log(`  📊 Health check       : http://localhost:${config.port}/api/health`);
  console.log(`  🌍 Environment        : ${config.nodeEnv}`);
  console.log(`  🔗 CORS origin        : ${config.corsOrigin}`);
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
