import { Request, Response, NextFunction } from 'express';
import { CandidateService } from '../services/candidate.service';
import { analyzeExperienceSchema } from '../validators/candidate.validator';
import { successResponse } from '../utils/response';

export class ExperienceController {
  static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const experiences = await CandidateService.getExperiences(req.user!.id);
      res.status(200).json(successResponse(experiences));
    } catch (err) {
      next(err);
    }
  }

  static async add(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { description, yearsOfExperience, employer, role, location } = req.body;
      if (!description) { res.status(400).json({ success: false, message: 'description is required' }); return; }
      const experience = await CandidateService.addExperience(req.user!.id, {
        description,
        yearsOfExperience: Number(yearsOfExperience) || 0,
        employer,
        role,
        location,
      });
      res.status(201).json(successResponse(experience, 'Experience added.'));
    } catch (err) {
      next(err);
    }
  }

  static async analyze(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { description } = analyzeExperienceSchema.parse(req.body);
      const result = await CandidateService.analyzeExperience(req.user!.id, description);
      res.status(200).json(successResponse(result, 'AI experience analysis complete.'));
    } catch (err) {
      next(err);
    }
  }
}
