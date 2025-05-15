const express = require('express');
const router = express.Router();
const consultationController = require('../controllers/consultationController');
const { requireAuth } = require('../middlewares/auth');

// Booking Routes

// Get available dates for booking (public)
router.get(
  '/api/consultation/available-dates',
  consultationController.getAvailableDates
);

// Get available time slots for a specific date (public)
router.get(
  '/api/consultation/available-timeslots',
  requireAuth,
  consultationController.getAvailableTimeSlots
);

// Submit a new booking (guarded by auth middleware)
router.post(
  '/api/consultation/create',
  requireAuth,
  consultationController.createConsultation
);

// (Optional) Get current user's booking
router.get(
  '/api/consultation/my-consultation',
  requireAuth,
  consultationController.getUserConsultation
);

// (Optional) Cancel a booking
router.post(
  '/api/consultation/cancel',
  requireAuth,
  consultationController.cancelConsultation
);

// (Optional) Reschedule a booking
router.post(
  '/api/consultation/reschedule',
  requireAuth,
  consultationController.rescheduleConsultation
);

module.exports = router;
