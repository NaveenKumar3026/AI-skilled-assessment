import { Request, Response, NextFunction } from 'express';
import { JobRoleService } from '../services/jobRole.service';
import { successResponse } from '../utils/response';

export class JobRoleController {
  static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const roles = await JobRoleService.getAllJobRoles();
      res.status(200).json(successResponse(roles));
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const role = await JobRoleService.getJobRoleById(req.params.id);
      res.status(200).json(successResponse(role));
    } catch (err) {
      next(err);
    }
  }
}
