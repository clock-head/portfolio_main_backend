import express from 'express';
const router = express.Router();
const authController = require('../controllers/authController');
import { requireAuth, requireOperatorAuth } from '../middleware/auth';
import { authRateLimiter } from '../middleware/rateLimiter';
import { verifyEmail } from '../controllers/verifyEmailController';

// Auth endpoints
router.post('/signup', authRateLimiter, authController.signup);
router.post('/login', authRateLimiter, authController.login);
router.post('/logout', requireAuth, authController.logout);
router.get('/me', authController.getCurrentUser);
router.patch('/verify-email', verifyEmail);
router.post('/send-verification-email', authController.sendVerificationEmail);

module.exports = router;
