import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { EvidenceService } from '../services/evidence.service';
import { idParamSchema } from '../validators/common.validator';
import { successResponse } from '../utils/response';

export class EvidenceController {
  static async upload(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const file = req.file as Express.Multer.File | undefined;
      if (!file) {
        res.status(400).json({ success: false, message: 'No file uploaded.' });
        return;
      }

      const fileType = (req.body.fileType || 'EXPERIENCE_LETTER').toUpperCase();
      const fileSizeKb = (file.size / 1024).toFixed(0);
      const fileSize = file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${fileSizeKb} KB`;

      const result = await EvidenceService.uploadEvidence(req.user!.id, {
        fileName: path.basename(file.originalname),
        fileType,
        fileSize,
        filePath: file.path,
      });

      res.status(201).json(successResponse(result, 'Evidence uploaded and AI analysis complete.'));
    } catch (err) {
      next(err);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const evidence = await EvidenceService.getEvidence(req.user!.id);
      res.status(200).json(successResponse(evidence));
    } catch (err) {
      next(err);
    }
  }

  static async analyze(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = idParamSchema.parse(req.params);
      const result = await EvidenceService.analyzeEvidence(id, req.user!);
      res.status(200).json(successResponse(result, 'AI evidence analysis complete.'));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Secure Authorized Download Endpoint (Requirement 21)
   * Streams file content instead of loading entire buffer in memory
   */
  static async download(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = idParamSchema.parse(req.params);
      const fileData = await EvidenceService.getEvidenceForDownload(id, req.user!);

      const safeDownloadName = path.basename(fileData.fileName).replace(/[^a-zA-Z0-9._-]/g, '_');

      res.setHeader('Content-Disposition', `attachment; filename="${safeDownloadName}"`);
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('X-Content-Type-Options', 'nosniff');

      const stream = fs.createReadStream(fileData.filePath);
      stream.on('error', (err) => {
        next(err);
      });
      stream.pipe(res);
    } catch (err) {
      next(err);
    }
  }
}
