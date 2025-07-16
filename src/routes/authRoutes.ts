import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Create a new user and return a JWT
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /api/auth/login
 * @desc    Login existing user and return a JWT
 * @access  Public
 */
router.post('/login', login);

export default router;