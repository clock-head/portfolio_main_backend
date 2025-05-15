const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Auth endpoints
router.post('/api/auth/signup', authController.signup);
router.post('/api/auth/login', authController.login);
router.post('/api/auth/logout', authController.logout);

module.exports = router;
