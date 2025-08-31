import { Router } from 'express';
import { ActivityController } from '../controllers/ActivityController';

const router = Router();
const activityController = new ActivityController();

/**
 * @route GET /activities/user/:userId
 * @description Get activities by user ID with pagination
 * @param {string} userId - User ID
 * @param {string} [cursor] - Optional cursor for pagination
 * @param {number} [limit] - Optional limit for number of items per page
 * @returns {Object} Paginated activities
 */
router.get('/user/:userId', (req, res) => activityController.getActivitiesByUserId(req, res));

export default router;
