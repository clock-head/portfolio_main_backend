import {
  generateWorkingDays,
  isWorkingDayNotice,
  generateAvailableTimeSlots,
} from '../utils/consultation.utils';

const {
  getConfirmedConsultationsForDate,
  getWorkSprintsForDate,
  getRecentConsultations,
  getActiveConsultation,
  getAttendedConsultations,
  getUserConsultation,
  rescheduleConsultation,
  createNewConsultation,
} = require('../../repositories/consultation.repositories');

const {
  verifyTwoCancelled,
  verifyTwoUnresolved,
  verifyThreeUnresolved,
  verifyFourUnresolved,
  verifyFourCancelled,
  cancelActiveConsultation,
  lockUserOut,
} = require('../services/consultationService');

const { Consultation } = require('../models/consultation.model');

import { IUser } from '../types/User';

const { Op } = require('sequelize');

import { Request, Response } from 'express';

module.exports = {
  createConsultation: async (req: Request, res: Response) => {
    try {
      const { selectedDate, selectedTime, name, email } = req.body;
      const user = req.user;

      // 1. Guard: Lockout Check
      if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
        return res.status(403).json({
          message:
            'You are currently locked out from making an appointment due to cancellations or repeated irresolution.',
        });
      }

      // 2. Guard: Active Booking Check

      const activeConsultation = await getActiveConsultation(user.user_id);

      if (activeConsultation) {
        return res.status(409).json({
          message: 'You already have an active consultation booking.',

          options: {
            prompt: 'Would you like to reschedule?',
            choices: [
              { label: 'Reschedule', action: 'reschedule' },
              { label: 'Keep current timeslot', action: 'close_window' },
            ],
            currentConsultationBooking: activeConsultation,
          },
        });
      }

      // 3. Guard: Consecutive Cancellation Lockout
      const recentConsultations = await getRecentConsultations(user.user_id, 4);
      const [first, second, third, fourth] = recentConsultations;
      const twoCancelled = await verifyTwoCancelled([first, second]);
      const today = new Date();

      if (twoCancelled) {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        if (first.createdAt > oneWeekAgo) {
          // Set lock
          const oneWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
          await lockUserOut(user, oneWeek);
          return res.status(403).json({
            message:
              'You are locked out for 1 week due to having cancelled twice in a row.',
          });
        }
      }

      // 4. Guard: Consecutive Unresolved Consultations Lockout
      const threeUnresolved = await verifyThreeUnresolved([
        first,
        second,
        third,
      ]);
      if (threeUnresolved) {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        if (first.createdAt > oneWeekAgo) {
          // Set lock
          const oneWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
          await lockUserOut(user, oneWeek);
          return res.status(403).json({
            message:
              'You are temporarily locked out due to three unresolved consultations.',
          });
        }
      }

      // 5. Guard: 4 Consecutive Cancellation Lockout (one month)

      const fourCancelled = await verifyFourCancelled(recentConsultations);
      if (fourCancelled) {
        const oneMonthAgo = new Date();
        oneMonthAgo.setDate(today.getDate() - 30);
        if (first.createdAt > oneMonthAgo) {
          // Set lock
          const oneMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          await lockUserOut(user, oneMonth);
          return res.status(403).json({
            message:
              'You have been locked out for a month due to four cancelled consultations.',
          });
        }
      }

      // 6. Guard: 4 consecutive Cancellation Lockout (one month)

      const fourUnresolved = await verifyFourUnresolved(recentConsultations);
      if (fourUnresolved) {
        const oneMonthAgo = new Date();
        oneMonthAgo.setDate(today.getDate() - 30);
        if (first.createdAt > oneMonthAgo) {
          // Set lock
          const oneMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          await lockUserOut(user, oneMonth);
          return res.status(403).json({
            message:
              'You have been locked out for a month due to four unresolved consultations.',
          });
        }
      }

      const newConsultation = await createNewConsultation({
        userId: user.user_id,
        name,
        email,
        selectedDate: selectedDate,
        selectedTime: selectedTime,
        status: 'pending',
        resolutionStatus: 'open',
        hasRescheduled: false,
        notes: null,
      });

      return res
        .status(201)
        .json({ message: 'Booking created successfully.', newConsultation });
    } catch (err) {
      console.error('[Create Booking Error]', err);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  },

  getUserConsultation: async (req: Request, res: Response) => {
    try {
      const consultation = await getUserConsultation(req.user.user_id);

      if (!consultation) {
        return res.status(404).json({ message: 'No active booking found.' });
      }

      return res.status(200).json({ consultation });
    } catch (err) {
      console.error('[Get Booking Error]', err);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  },

  cancelConsultation: async (req: Request, res: Response) => {
    try {
      const consultation = await getActiveConsultation(req.user.user_id);

      if (!consultation) {
        return res.status(404).json({ message: 'No booking to cancel.' });
      }

      const cancelledConsultation = await cancelActiveConsultation(
        consultation
      );

      return res
        .status(200)
        .json({ message: 'Booking cancelled.', cancelledConsultation });
    } catch (err) {
      console.error('[Cancel Booking Error]', err);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  },

  rescheduleConsultation: async (req: Request, res: Response) => {
    try {
      const user = req.user;
      const { newDate, newStartTime, newEndTime } = req.body;

      const consultation = await getActiveConsultation(user.user_id);

      // 1. Guard: check if the user has an active booking

      if (!consultation) {
        return res
          .status(404)
          .json({ message: 'No active booking found to reschedule.' });
      }

      // 2. Guard: Check if the user has rescheduled before

      if (consultation.hasRescheduled) {
        return res.status(403).json({
          message: 'You’ve already used your one-time reschedule option.',
        });
      }

      const now = new Date();
      const isValidNotice = isWorkingDayNotice(consultation.selectedDate, now);

      if (!isValidNotice) {
        return res.status(403).json({
          message: 'Changes require at least 1 working day notice.',
          options: {
            prompt: 'Would you like to cancel your booking?',
            choices: [
              // fire cancel consultation API
              { label: 'Cancel booking', action: 'cancel' },
              { label: 'Keep current timeslot', action: 'close_window' },
            ],
            currentBooking: consultation,
          },
        });
      }

      // Block reschedule with same date/time
      if (
        consultation.selectedDate === newDate &&
        consultation.startTime === newStartTime
      ) {
        return res
          .status(400)
          .json({ message: 'This is already your current booking time.' });
      }

      // Update with new time and flag reschedule
      const newConsultation = await rescheduleConsultation(
        consultation,
        newDate,
        newStartTime,
        newEndTime
      );

      return res.status(200).json({
        message: 'Your consultation booking has been rescheduled.',
        newConsultation,
      });
    } catch (err) {
      console.error('[Reschedule Consultation Booking Error]', err);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  },

  getAvailableDates: async (req: Request, res: Response) => {
    try {
      const user = req.user;
      const month = parseInt(req.query.month as string, 10); // current month passed in through frontend query params.
      const year = parseInt(req.query.year as string, 10); // current year passed in through frontend query params.
      let offsetDays = 0;

      if (isNaN(month) || isNaN(year)) {
        return res.status(400).json({ message: 'Invalid query parameters.' });
      }

      //Looped indecision check
      const attended = await getAttendedConsultations(user.user_id, 2);
      const bothUnresolved = await verifyTwoUnresolved(attended);

      if (bothUnresolved) {
        offsetDays = 3; // Skip 3 calendar days
      }

      const startDate = new Date(year, month - 1, 1); // returns a Date object
      startDate.setDate(startDate.getDate() + offsetDays);

      //Dynamically determine how many days in the selected month

      const daysInMonth = new Date(year, month, 0).getDate();

      const availableDates = generateWorkingDays(startDate, daysInMonth);

      return res.status(200).json({ availableDates });
    } catch (err) {
      console.error('[getAvailableDates Error]', err);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  },

  getAvailableTimeSlots: async (req: Request, res: Response) => {
    try {
      const { date } = req.query;
      const user = req.user;

      if (!date) {
        return res.status(400).json({ message: 'Date is required.' });
      }

      // Fetch confirmed consultations on that date
      const consults = await getConfirmedConsultationsForDate(date);

      // Fetch work sprints on that date
      const sprints = await getWorkSprintsForDate(date);

      // Combine consult and sprint blocks into exclusion times
      // Final result: all time slots minus blocked ones
      const availableTimeSlots = generateAvailableTimeSlots(consults, sprints);

      return res.status(200).json({ date, availableTimeSlots });
    } catch (err) {
      console.error('[getAvailableTimeSlots Error]', err);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  },
};
