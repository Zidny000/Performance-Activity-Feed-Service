import { Request, Response } from 'express';
import { ActivityService } from '../services/ActivityService';
import { errorLogger } from '../utils/logger';

export class ActivityController {
  private activityService: ActivityService;

  constructor() {
    this.activityService = new ActivityService();
  }

  /**
   * Get activities by user ID with pagination
   * @param req Request with userId as param and cursor & limit as query params
   * @param res Response
   */
  async getActivitiesByUserId(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        res.status(400).json({ 
          success: false, 
          message: 'User ID is required' 
        });
        return;
      }

      const { cursor, limit } = req.query;
      
      const result = await this.activityService.getActivitiesByUserId(userId, {
        cursor: cursor?.toString(),
        limit: limit ? parseInt(limit.toString()) : undefined
      });

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      errorLogger.error('Error in ActivityController.getActivitiesByUserId:', error);
      
      if (error instanceof Error && error.message === 'Invalid cursor format') {
        res.status(400).json({ 
          success: false, 
          message: 'Invalid cursor format'
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to fetch activities'
      });
    }
  }
}
