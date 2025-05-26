import express from 'express';
const router = express.Router();
const consultationController = require('../controllers/consultationController');
const { requireAuth } = require('../middleware/auth');

// Booking Routes

// Get available dates for booking (public)
router.get('/available-dates', consultationController.getAvailableDates);

// Get available time slots for a specific date (public)
router.get(
  '/available-timeslots',
  requireAuth,
  consultationController.getAvailableTimeSlots
);

// Submit a new booking (guarded by auth middleware)
router.post('/create', requireAuth, consultationController.createConsultation);

// (Optional) Get current user's booking
router.get(
  '/my-consultation',
  requireAuth,
  consultationController.getUserConsultation
);

// (Optional) Cancel a booking
router.post('/cancel', requireAuth, consultationController.cancelConsultation);

// (Optional) Reschedule a booking
router.post(
  '/reschedule',
  requireAuth,
  consultationController.rescheduleConsultation
);

module.exports = router;
