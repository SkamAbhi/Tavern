// routes/authRoutes.js
import express from 'express';
import { signup, login, logout, getMe, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { loginSchema, signupSchema, updateProfileSchema } from '../validations/authSchemas.js';

const router = express.Router();


// Public routes
router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, validate(updateProfileSchema), updateProfile);

export default router;