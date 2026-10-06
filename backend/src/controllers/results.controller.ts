import { Request, Response, NextFunction } from 'express';
import { ResultsService } from '../services/results.service';
import { safeIdSchema } from '../validators/common.validator';
import { successResponse } from '../utils/response';

export class ResultsController {
  static async getAssessmentResults(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const assessmentId = safeIdSchema.parse(req.params.assessmentId);
      const result = await ResultsService.getAssessmentResults(assessmentId, req.user!);
      res.status(200).json(successResponse(result));
    } catch (err) {
      next(err);
    }
  }

  static async getSkillGaps(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const candidateId = safeIdSchema.parse(req.params.candidateId);
      const gaps = await ResultsService.getSkillGaps(candidateId, req.user!);
      res.status(200).json(successResponse(gaps));
    } catch (err) {
      next(err);
    }
  }
}
