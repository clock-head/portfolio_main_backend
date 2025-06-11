import express from 'express';
const router = express.Router();
const authController = require('../controllers/authController');
import { requireAuth, requireOperatorAuth } from '../middleware/auth';
import { authRateLimiter } from '../middleware/rateLimiter';

// Auth endpoints
router.post('/signup', authRateLimiter, authController.signup);
router.post('/login', authController.login);
router.post('/logout', requireAuth, authController.logout);
router.get('/me', authController.getCurrentUser);
router.get('/verify-email', authController.verifyEmail);

module.exports = router;
