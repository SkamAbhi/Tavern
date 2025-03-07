import express from 'express';
import { signup, login, logout } from '../controllers/authController.js';
import validate from '../middleware/validate.js';
import { loginSchema, signupSchema } from '../validations/authSchemas.js';

const router = express.Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);

export default router;