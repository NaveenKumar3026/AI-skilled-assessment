import { Request, Response, NextFunction } from 'express';
import { CertificationService } from '../services/certification.service';
import { successResponse } from '../utils/response';

export class CertificationController {
  static async recommend(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { candidateId } = req.body;
      if (!candidateId) { res.status(400).json({ success: false, message: 'candidateId is required.' }); return; }
      const result = await CertificationService.recommendCertification(candidateId);
      res.status(200).json(successResponse(result));
    } catch (err) {
      next(err);
    }
  }

  static async getCertifications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cert = await CertificationService.getCertifications(req.params.candidateId);
      res.status(200).json(successResponse(cert));
    } catch (err) {
      next(err);
    }
  }
}
