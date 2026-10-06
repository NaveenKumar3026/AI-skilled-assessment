import { Request, Response, NextFunction } from 'express';
import { AssessorService } from '../services/assessor.service';
import { createReviewSchema, updateReviewSchema } from '../validators/assessor.validator';
import { idParamSchema } from '../validators/common.validator';
import { successResponse } from '../utils/response';

export class AssessorController {
  static async getCandidates(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const candidates = await AssessorService.getCandidatesQueue();
      res.status(200).json(successResponse(candidates));
    } catch (err) {
      next(err);
    }
  }

  static async getAssessment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = idParamSchema.parse(req.params);
      const assessment = await AssessorService.getAssessmentForReview(id);
      res.status(200).json(successResponse(assessment));
    } catch (err) {
      next(err);
    }
  }

  static async createReview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = createReviewSchema.parse(req.body);
      const result = await AssessorService.createReview(req.user!.id, data);
      res.status(201).json(successResponse(result, `Review submitted. Decision: ${result.decision}`));
    } catch (err) {
      next(err);
    }
  }

  static async updateReview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = idParamSchema.parse(req.params);
      const data = updateReviewSchema.parse(req.body);
      const review = await AssessorService.updateReview(id, req.user!.id, data);
      res.status(200).json(successResponse(review, 'Review updated.'));
    } catch (err) {
      next(err);
    }
  }
}
