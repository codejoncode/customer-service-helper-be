import { Router } from "express";
import { register, login } from "../controllers/authController";
import { loginLimiter, registerLimiter } from "../middleware/rateLimiters";

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Create a new user and return a JWT
 * @access  Public
 */
router.post("/register", registerLimiter, register);

/**
 * @route   POST /api/auth/login
 * @desc    Login existing user and return a JWT
 * @access  Public
 */
router.post("/login", loginLimiter, login);

export default router;
