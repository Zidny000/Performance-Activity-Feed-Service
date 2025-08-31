import { DataSource } from 'typeorm';
import { Activity } from '../models/Activity';
import { CursorData, PaginatedResult, encodeCursor } from '../utils/cursorPagination';
import { errorLogger } from '../utils/logger';

export const ActivityRepository = (dataSource: DataSource) => 
  dataSource.getRepository(Activity).extend({
    /**
   * Get activities by user ID with seek pagination
   * @param userId User ID
   * @param limit Number of records to return
   * @param cursor Optional cursor for pagination
   * @returns Paginated activities
   */
    async getActivitiesByUserId(
      userId: string, 
      limit: number, 
      cursor?: CursorData
    ): Promise<PaginatedResult<Activity>> {
      try {
        // Create query builder for efficient pagination
        const queryBuilder = this.createQueryBuilder('activity')
          .where('activity.userId = :userId', { userId })
          .leftJoinAndSelect('activity.post', 'post')
          .orderBy('activity.createdAt', 'DESC')
          .addOrderBy('activity.id', 'DESC')
          .take(limit + 1); // Fetch one extra to determine if there are more pages

        // Apply cursor-based filtering if cursor is provided
        if (cursor) {
          queryBuilder.andWhere(
            '(activity.createdAt < :createdAt OR (activity.createdAt = :createdAt AND activity.id < :id))',
            { 
              createdAt: cursor.createdAt,
              id: cursor.id
            }
          );
        }

        const activities = await queryBuilder.getMany();

        // Determine if there are more pages
        const hasNextPage = activities.length > limit;
        // Remove the extra item we used to check for next page
        const items = hasNextPage ? activities.slice(0, limit) : activities;

        // Generate next cursor if there are more pages
        let nextCursor: string | null = null;
        if (hasNextPage && items.length > 0) {
          const lastItem = items[items.length - 1];
          nextCursor = encodeCursor(lastItem.createdAt, lastItem.id);
        }

        return {
          items,
          pageInfo: {
            nextCursor,
            hasNextPage
          }
        };
      } catch (error) {
        errorLogger.error('Error fetching activities by user ID:', error);
        throw new Error('Failed to fetch activities');
      }
    }
  })

