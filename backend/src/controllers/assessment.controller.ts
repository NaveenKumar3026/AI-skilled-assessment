import { Request, Response, NextFunction } from 'express';
import { AssessmentService } from '../services/assessment.service';
import { createAssessmentSchema, submitResponseSchema } from '../validators/assessment.validator';
import { successResponse } from '../utils/response';

export class AssessmentController {
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { jobRoleId, type } = createAssessmentSchema.parse(req.body);
      const result = await AssessmentService.createAssessment(req.user!.id, jobRoleId, type);
      res.status(201).json(successResponse(result, 'Assessment created.'));
    } catch (err) {
      next(err);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const assessments = await AssessmentService.getAssessments(req.user!.id);
      res.status(200).json(successResponse(assessments));
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const assessment = await AssessmentService.getAssessmentById(req.params.id);
      res.status(200).json(successResponse(assessment));
    } catch (err) {
      next(err);
    }
  }

  static async submitResponse(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { questionId, selectedOptionId } = submitResponseSchema.parse(req.body);
      const result = await AssessmentService.submitResponse(req.params.id, questionId, selectedOptionId);
      res.status(200).json(successResponse(result));
    } catch (err) {
      next(err);
    }
  }

  static async submit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AssessmentService.submitAssessment(req.params.id, req.user!.id);
      res.status(200).json(successResponse(result, `Assessment submitted. Score: ${result.score}%`));
    } catch (err) {
      next(err);
    }
  }

  static async getQuestions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const questions = await AssessmentService.getQuestions(req.params.jobRoleId);
      res.status(200).json(successResponse(questions));
    } catch (err) {
      next(err);
    }
  }
}
