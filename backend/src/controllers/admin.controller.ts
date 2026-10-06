import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service';
import { successResponse } from '../utils/response';

export class AdminController {
  static async getDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await AdminService.getDashboardStats();
      res.status(200).json(successResponse(stats));
    } catch (err) {
      next(err);
    }
  }

  static async getCandidates(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const filters = {
        trade: req.query.trade as string,
        status: req.query.status as string,
      };
      const result = await AdminService.getAllCandidates(page, limit, filters);
      res.status(200).json(successResponse(result.candidates, undefined, result.meta));
    } catch (err) {
      next(err);
    }
  }

  static async getAssessments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await AdminService.getAllAssessments(page, limit);
      res.status(200).json(successResponse(result.assessments, undefined, result.meta));
    } catch (err) {
      next(err);
    }
  }

  static async getAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const analytics = await AdminService.getAnalytics();
      res.status(200).json(successResponse(analytics));
    } catch (err) {
      next(err);
    }
  }
}
