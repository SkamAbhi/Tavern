// routes/tavernRoutes.js
import express from 'express';
import { updatePosition, getNearbyUsers } from '../controllers/tavernController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.put('/position', protect, updatePosition);
router.get('/nearby-users', protect, getNearbyUsers);

export default router;