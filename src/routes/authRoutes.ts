import express from 'express';
import { Request, Response } from 'express';
const router = express.Router();
const authController = require('../controllers/authController');
import { requireAuth, requireOperatorAuth } from '../middleware/auth';
import { authRateLimiter } from '../middleware/rateLimiter';
import {
  sendVerificationEmail,
  generateVerificationToken,
} from '../services/emailService';

// Auth endpoints
router.post('/signup', authRateLimiter, authController.signup);
router.post('/login', authRateLimiter, authController.login);
router.post('/logout', requireAuth, authController.logout);
router.get('/me', authController.getCurrentUser);
router.get('/verify-email', authController.verifyEmail);
router.post('/send-verification', authController.sendVerificationEmail);

module.exports = router;
