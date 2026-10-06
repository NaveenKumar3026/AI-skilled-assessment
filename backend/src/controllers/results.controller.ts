import { Request, Response, NextFunction } from 'express';
import { ResultsService } from '../services/results.service';
import { successResponse } from '../utils/response';

export class ResultsController {
  static async getAssessmentResults(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await ResultsService.getAssessmentResults(req.params.assessmentId);
      res.status(200).json(successResponse(result));
    } catch (err) {
      next(err);
    }
  }

  static async getSkillGaps(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const gaps = await ResultsService.getSkillGaps(req.params.candidateId);
      res.status(200).json(successResponse(gaps));
    } catch (err) {
      next(err);
    }
  }
}
