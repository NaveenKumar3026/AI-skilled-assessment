import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AdminService } from '../services/admin.service';
import { successResponse } from '../utils/response';
import { paginationQuerySchema } from '../validators/common.validator';

const candidateFilterSchema = paginationQuerySchema.extend({
  trade: z.string().trim().max(100).optional(),
  status: z.string().trim().max(50).optional(),
});

export class AdminController {
  static async getDashboard(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await AdminService.getDashboardStats();
      res.status(200).json(successResponse(stats));
    } catch (err) {
      next(err);
    }
  }

  static async getCandidates(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, trade, status } = candidateFilterSchema.parse(req.query);
      const filters = {
        trade: trade || '',
        status: status || '',
      };
      const result = await AdminService.getAllCandidates(page, limit, filters);
      res.status(200).json(successResponse(result.candidates, undefined, result.meta));
    } catch (err) {
      next(err);
    }
  }

  static async getAssessments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit } = paginationQuerySchema.parse(req.query);
      const result = await AdminService.getAllAssessments(page, limit);
      res.status(200).json(successResponse(result.assessments, undefined, result.meta));
    } catch (err) {
      next(err);
    }
  }

  static async getAnalytics(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const analytics = await AdminService.getAnalytics();
      res.status(200).json(successResponse(analytics));
    } catch (err) {
      next(err);
    }
  }
}
