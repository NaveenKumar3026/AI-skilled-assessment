import { Request, Response, NextFunction } from 'express';
import { EvidenceService } from '../services/evidence.service';
import { successResponse } from '../utils/response';
import path from 'path';

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
        fileName: file.originalname,
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
      const result = await EvidenceService.analyzeEvidence(req.params.id, req.user!.id);
      res.status(200).json(successResponse(result, 'AI evidence analysis complete.'));
    } catch (err) {
      next(err);
    }
  }
}
