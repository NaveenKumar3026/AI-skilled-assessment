import { Request, Response, NextFunction } from 'express';
import { CandidateService } from '../services/candidate.service';
import { updateProfileSchema } from '../validators/candidate.validator';
import { successResponse } from '../utils/response';

export class CandidateController {
  static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profile = await CandidateService.getProfile(req.user!.id);
      res.status(200).json(successResponse(profile));
    } catch (err) {
      next(err);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = updateProfileSchema.parse(req.body);
      const profile = await CandidateService.updateProfile(req.user!.id, data);
      res.status(200).json(successResponse(profile, 'Profile updated successfully.'));
    } catch (err) {
      next(err);
    }
  }
}
