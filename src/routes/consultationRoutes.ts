import express from 'express';
const router = express.Router();
const consultationController = require('../controllers/consultationController');
import { requireAuth, requireOperatorAuth } from '../middleware/auth';

// Booking Routes

// Get available dates for booking (public)
router.get('/available-dates', consultationController.getAvailableDates);

// Get available time slots for a specific date (public)
router.get(
  '/available-timeslots',
  consultationController.getAvailableTimeSlots
);

// Submit a new booking (guarded by auth middleware)
router.post('/create', requireAuth, consultationController.createConsultation);

// Change Consultation status
router.patch(
  '/change-consultation-status/:consultationId',
  requireOperatorAuth,
  consultationController.changeConsultationStatus
);

// (Optional) Get current user's booking
router.get(
  '/my-active-consultation',
  requireAuth,
  consultationController.getActiveConsultation
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
