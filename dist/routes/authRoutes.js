"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const authController = require('../controllers/authController');
const auth_1 = require("../middleware/auth");
const rateLimiter_1 = require("../middleware/rateLimiter");
// Auth endpoints
router.post('/signup', rateLimiter_1.authRateLimiter, authController.signup);
router.post('/login', rateLimiter_1.authRateLimiter, authController.login);
router.post('/logout', auth_1.requireAuth, authController.logout);
router.get('/me', authController.getCurrentUser);
router.get('/verify-email', authController.verifyEmail);
module.exports = router;
