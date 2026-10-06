import { Request, Response, NextFunction } from 'express';
import { PracticalService } from '../services/practical.service';
import { successResponse } from '../utils/response';

export class PracticalController {
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { taskTitle, taskInstructions } = req.body;
      if (!taskTitle || !taskInstructions) {
        res.status(400).json({ success: false, message: 'taskTitle and taskInstructions are required.' });
        return;
      }
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
      const practical = await PracticalService.getPracticalAssessment(req.params.id);
      res.status(200).json(successResponse(practical));
    } catch (err) {
      next(err);
    }
  }

  static async analyze(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const videoPath = (req.file as Express.Multer.File | undefined)?.path;
      const result = await PracticalService.analyzePracticalVideo(req.params.id, req.user!.id, videoPath);
      res.status(200).json(successResponse(result, 'AI practical video analysis complete.'));
    } catch (err) {
      next(err);
    }
  }
}
