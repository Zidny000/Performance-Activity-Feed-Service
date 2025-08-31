import { errorLogger } from './logger';

export interface PaginatedResult<T> {
  items: T[];
  pageInfo: {
    nextCursor: string | null;
    hasNextPage: boolean;
  };
}

export interface PaginationParams {
  cursor?: string;
  limit?: number;
}

export interface CursorData {
  createdAt: Date;
  id: string;
}

/**
 * Encode cursor from createdAt and id
 * @param createdAt 
 * @param id 
 * @returns Base64 encoded cursor
 */
export function encodeCursor(createdAt: Date, id: string): string {
  try {
    const cursor = JSON.stringify({ createdAt: createdAt.toISOString(), id });
    return Buffer.from(cursor).toString('base64');
  } catch (error) {
    errorLogger.error('Error encoding cursor:', error);
    throw new Error('Failed to encode cursor');
  }
}

/**
 * Decode cursor to get createdAt and id
 * @param cursor Base64 encoded cursor
 * @returns Object with createdAt and id
 */
export function decodeCursor(cursor: string): CursorData {
  try {
    const decoded = Buffer.from(cursor, 'base64').toString();
    const data = JSON.parse(decoded);
    return {
      createdAt: new Date(data.createdAt),
      id: data.id
    };
  } catch (error) {
    errorLogger.error('Error decoding cursor:', error);
    throw new Error('Invalid cursor format');
  }
}

/**
 * Default limit for pagination if not specified
 */
export const DEFAULT_PAGE_LIMIT = 20;

/**
 * Max limit for pagination to prevent performance issues
 */
export const MAX_PAGE_LIMIT = 100;
