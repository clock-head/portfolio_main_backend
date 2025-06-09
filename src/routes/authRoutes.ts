import express from 'express';
const router = express.Router();
const authController = require('../controllers/authController');
import { authRateLimiter } from '../middleware/rateLimiter';

// Auth endpoints
router.post('/signup', authRateLimiter, authController.signup);
router.post('/login', authRateLimiter, authController.login);
router.post('/logout', authController.logout);
router.get('/me', authController.getCurrentUser);
router.get('/verify-email', authController.verifyEmail);

module.exports = router;
