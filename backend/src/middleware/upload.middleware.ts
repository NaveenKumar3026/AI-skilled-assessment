import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env';
import { securityConfig } from '../config/security.config';
import { FileSecurityService } from '../services/fileSecurity.service';
import { errorResponse } from '../utils/response';

// Ensure upload directory exists outside web root
const uploadDir = path.resolve(config.uploadDir);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    // Generate strictly random server-side filename (crypto.randomUUID)
    // Never trust original filename as storage path
    const ext = path.extname(file.originalname).toLowerCase();
    try {
      const safeFilename = FileSecurityService.generateRandomFilename(ext);
      cb(null, safeFilename);
    } catch (err) {
      cb(err as Error, '');
    }
  },
});

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  // Validate extension allowlist
  if (!securityConfig.uploads.allowedExtensions.includes(ext)) {
    return cb(
      new Error(
        `File extension '${ext}' is rejected. Allowed extensions: ${securityConfig.uploads.allowedExtensions.join(', ')}`
      )
    );
  }

  // Validate MIME type allowlist
  if (!securityConfig.uploads.allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      new Error(
        `MIME type '${file.mimetype}' is not permitted. Only PDF, JPG, PNG, WEBP, and MP4 are accepted.`
      )
    );
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: securityConfig.uploads.maxSizeBytes,
    files: 1, // Single file upload limit per request
  },
});

/**
 * Middleware that performs deep inspection (magic bytes + malware scan) on the uploaded file.
 * Automatically deletes the file and rejects the request if verification fails.
 */
export async function validateUploadedFile(req: Request, res: Response, next: NextFunction): Promise<void> {
  const file = req.file;
  if (!file) return next();

  try {
    const ext = path.extname(file.originalname).toLowerCase();

    // 1. Inspect magic bytes signature
    const signatureCheck = await FileSecurityService.validateFileSignature(file.path, ext);
    if (!signatureCheck.isValid) {
      await fs.promises.unlink(file.path).catch(() => {});
      res.status(400).json(
        errorResponse(
          signatureCheck.error || 'File signature does not match claimed file format.',
          'INVALID_FILE_SIGNATURE'
        )
      );
      return;
    }

    // 2. Scan for malicious payloads / scripts
    const scanResult = await FileSecurityService.scan(file.path);
    if (!scanResult.isClean) {
      await fs.promises.unlink(file.path).catch(() => {});
      res.status(400).json(
        errorResponse(
          `Security check failed: File rejected due to suspicious content (${scanResult.threatName || 'ThreatDetected'}).`,
          'MALWARE_DETECTED'
        )
      );
      return;
    }

    next();
  } catch (err) {
    if (file?.path) {
      await fs.promises.unlink(file.path).catch(() => {});
    }
    next(err);
  }
}

export const uploadSingle = (field: string) => [upload.single(field), validateUploadedFile];
export const uploadMultiple = (field: string, maxCount = 5) => upload.array(field, maxCount);
