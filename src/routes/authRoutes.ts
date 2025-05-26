import express from 'express';
const router = express.Router();
const authController = require('../controllers/authController');

// Auth endpoints
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', authController.getCurrentUser);

module.exports = router;
