"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const consultationController = require('../controllers/consultationController');
const { requireAuth, requireOperatorAuth } = require('../middleware/auth');
// Booking Routes
// Get available dates for booking (public)
router.get('/available-dates', consultationController.getAvailableDates);
// Get available time slots for a specific date (public)
router.get('/available-timeslots', consultationController.getAvailableTimeSlots);
// Submit a new booking (guarded by auth middleware)
router.post('/create', requireAuth, consultationController.createConsultation);
// Change Consultation status
router.post('/change-consultation-status', requireOperatorAuth, consultationController.changeConsultationStatus);
// (Optional) Get current user's booking
router.get('/my-consultation', requireAuth, consultationController.getUserConsultation);
// (Optional) Cancel a booking
router.post('/cancel', requireAuth, consultationController.cancelConsultation);
// (Optional) Reschedule a booking
router.post('/reschedule', requireAuth, consultationController.rescheduleConsultation);
module.exports = router;
