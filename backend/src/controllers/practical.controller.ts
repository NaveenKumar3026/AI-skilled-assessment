import { Request, Response, NextFunction } from 'express';
import { PracticalService } from '../services/practical.service';
import { safeIdSchema } from '../validators/common.validator';
import { successResponse } from '../utils/response';
import { z } from 'zod';

const createPracticalSchema = z.object({
  taskTitle: z.string().trim().min(3).max(200),
  taskInstructions: z.string().trim().min(5).max(2000),
});

export class PracticalController {
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { taskTitle, taskInstructions } = createPracticalSchema.parse(req.body);
      const practical = await PracticalService.createPracticalAssessment(req.user!.id, {
        taskTitle,
        taskInstructions,
      });
      res.status(201).json(successResponse(practical, 'Practical assessment created.'));
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = safeIdSchema.parse(req.params.id);
      const practical = await PracticalService.getPracticalAssessment(id, req.user!);
      res.status(200).json(successResponse(practical));
    } catch (err) {
      next(err);
    }
  }

  static async analyze(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = safeIdSchema.parse(req.params.id);
      const videoPath = (req.file as Express.Multer.File | undefined)?.path;
      const result = await PracticalService.analyzePracticalVideo(id, req.user!, videoPath);
      res.status(200).json(successResponse(result, 'AI practical video analysis complete.'));
    } catch (err) {
      next(err);
    }
  }
}
