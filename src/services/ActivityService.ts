import { Activity } from '../models/Activity';
import { ActivityRepository } from '../repositories/ActivityRepository';
import { CursorData, DEFAULT_PAGE_LIMIT, MAX_PAGE_LIMIT, PaginatedResult, PaginationParams, decodeCursor } from '../utils/cursorPagination';
import { errorLogger } from '../utils/logger';
import dataSource from '../config/dataSource';

export class ActivityService {
  private activityRepository = ActivityRepository(dataSource);

  /**
   * Get activities by user ID with pagination
   * @param userId User ID
   * @param params Pagination parameters (cursor and limit)
   * @returns Paginated activities
   */
  async getActivitiesByUserId(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedResult<Activity>> {
    try {
      // Parse limit with defaults and maximum
      const limit = Math.min(
        params.limit ? parseInt(params.limit.toString()) : DEFAULT_PAGE_LIMIT,
        MAX_PAGE_LIMIT
      );

      // Decode cursor if provided
      let cursorData: CursorData | undefined;
      if (params.cursor) {
        cursorData = decodeCursor(params.cursor);
      }

      return await this.activityRepository.getActivitiesByUserId(userId, limit, cursorData);
    } catch (error) {
      errorLogger.error('Error in ActivityService.getActivitiesByUserId:', error);
      throw error;
    }
  }
}
