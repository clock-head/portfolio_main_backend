import express from 'express';
const router = express.Router();
const stripeController = require('../controllers/stripeController');
const { requireAuth } = require('../middleware/auth');

router.post(
  '/create-checkout-session',
  requireAuth,
  stripeController.createCheckoutSession
);

module.exports = router;
