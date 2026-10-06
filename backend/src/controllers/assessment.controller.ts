import { Request, Response, NextFunction } from 'express';
import { AssessmentService } from '../services/assessment.service';
import { createAssessmentSchema, submitResponseSchema } from '../validators/assessment.validator';
import { idParamSchema } from '../validators/common.validator';
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
      const { id } = idParamSchema.parse(req.params);
      const assessment = await AssessmentService.getAssessmentById(id, req.user!);
      res.status(200).json(successResponse(assessment));
    } catch (err) {
      next(err);
    }
  }

  static async submitResponse(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = idParamSchema.parse(req.params);
      const { questionId, selectedOptionId } = submitResponseSchema.parse(req.body);
      const result = await AssessmentService.submitResponse(id, questionId, selectedOptionId, req.user!);
      res.status(200).json(successResponse(result));
    } catch (err) {
      next(err);
    }
  }

  static async submit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = idParamSchema.parse(req.params);
      const result = await AssessmentService.submitAssessment(id, req.user!);
      res.status(200).json(successResponse(result, `Assessment submitted. Score: ${result.score}%`));
    } catch (err) {
      next(err);
    }
  }

  static async getQuestions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id: jobRoleId } = idParamSchema.parse({ id: req.params.jobRoleId });
      const questions = await AssessmentService.getQuestions(jobRoleId);
      res.status(200).json(successResponse(questions));
    } catch (err) {
      next(err);
    }
  }
}
