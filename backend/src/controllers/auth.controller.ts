import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import { successResponse } from '../utils/response';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = registerSchema.parse({ ...req.body, yearsOfExperience: Number(req.body.yearsOfExperience) });
      const result = await AuthService.register(data);
      res.status(201).json(successResponse(result, 'Registration successful. Welcome to SkillSet AI!'));
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = loginSchema.parse(req.body);
      const result = await AuthService.login(data);
      res.status(200).json(successResponse(result, 'Login successful.'));
    } catch (err) {
      next(err);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const result = await AuthService.getMe(userId);
      res.status(200).json(successResponse(result));
    } catch (err) {
      next(err);
    }
  }
}
