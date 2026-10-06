import { Request, Response, NextFunction } from 'express';
import { SkillsService } from '../services/skills.service';
import { successResponse } from '../utils/response';

export class SkillsController {
  static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await SkillsService.getSkillProfile(req.user!.id);
      res.status(200).json(successResponse(result));
    } catch (err) {
      next(err);
    }
  }

  static async getRecommendations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await SkillsService.getRecommendations(req.user!.id);
      res.status(200).json(successResponse(result));
    } catch (err) {
      next(err);
    }
  }
}
