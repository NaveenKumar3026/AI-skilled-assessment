import { Request, Response, NextFunction } from 'express';
import { CertificationService } from '../services/certification.service';
import { safeIdSchema } from '../validators/common.validator';
import { successResponse, errorResponse } from '../utils/response';

export class CertificationController {
  static async recommend(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const candidateId = safeIdSchema.parse(req.body.candidateId);
      const result = await CertificationService.recommendCertification(candidateId, req.user!);
      res.status(200).json(successResponse(result));
    } catch (err) {
      next(err);
    }
  }

  static async getCertifications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const candidateId = safeIdSchema.parse(req.params.candidateId);
      const cert = await CertificationService.getCertifications(candidateId, req.user!);
      res.status(200).json(successResponse(cert));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Public Verification Endpoint (Requirement 27)
   */
  static async verify(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const verificationId = safeIdSchema.parse(req.params.verificationId);
      const publicData = await CertificationService.verifyCertificate(verificationId);
      res.status(200).json(successResponse(publicData, 'Certificate verification verified successfully.'));
    } catch (err) {
      next(err);
    }
  }
}
