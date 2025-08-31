import { Router } from 'express';
import activityRoutes from './activities';

const router = Router();

router.use('/activities', activityRoutes);

export default router;
