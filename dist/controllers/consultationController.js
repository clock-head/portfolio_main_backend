"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const consultation_utils_1 = require("../utils/consultation.utils");
const { getConsultationByPk, getConfirmedConsultationsForDate, getRecentConsultations, getActiveConsultation, getAttendedConsultations, getUserConsultation, rescheduleConsultation, createNewConsultation, } = require('../repositories/consultation.repositories');
const { getWorksprintsForDate, createNewWorksprint, } = require('../repositories/worksprints.repositories');
const { verifyTwoCancelled, verifyTwoUnresolved, verifyThreeUnresolved, verifyFourUnresolved, verifyFourCancelled, cancelActiveConsultation, lockUserOut, } = require('../services/consultationService');
const { toZonedTime, format } = require('date-fns-tz');
const { Op } = require('sequelize');
const { isValidTimeZone } = require('../utils/time.utils');
const date_fns_1 = require("date-fns");
module.exports = {
    createConsultation: async (req, res) => {
        // typescript compiler is looking for a user object here
        try {
            const { selectedDate, startTime, endTime, timeZone } = req.body;
            const user = req.user;
            const utcDate = new Date();
            if (!isValidTimeZone(timeZone)) {
                throw new Error('invalid time zone');
            }
            const localDate = toZonedTime(utcDate, timeZone);
            const localDateFormatted = format(localDate, 'yyyy-MM-dd HH:mm:ssXXX', {
                timeZone,
            });
            // 1. Guard: Lockout Check
            if (user?.lockedUntil && new Date(user?.lockedUntil) > localDate) {
                // console.log(localDate);
                return res.status(403).json({
                    message: 'You are currently locked out from making an appointment due to cancellations or repeated irresolution.',
                });
            }
            // 2. Guard: Active Booking Check
            const activeConsultation = await getActiveConsultation(user?.user_id);
            if (activeConsultation) {
                return res.status(409).json({
                    message: 'You already have an active consultation booking.',
                    options: {
                        prompt: 'Would you like to reschedule?',
                        // for the frontend
                        choices: [
                            { label: 'Reschedule', action: 'reschedule' },
                            { label: 'Keep current timeslot', action: 'close_window' },
                        ],
                        currentConsultationBooking: activeConsultation,
                    },
                });
            }
            // 3. Guard: Consecutive Cancellation Lockout
            const recentConsultations = await getRecentConsultations(user?.user_id, 4);
            // if there are no recent consultations, skip the checks
            if (recentConsultations) {
                const [first, second, third, fourth] = recentConsultations;
                // if there are less than 2 consultations, skip the checks
                if (first && second) {
                    const twoCancelled = await verifyTwoCancelled([first, second]);
                    const today = localDate;
                    if (twoCancelled) {
                        const oneWeekAgo = localDate;
                        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                        if (first.createdAt > oneWeekAgo) {
                            // Set lock
                            // for testing
                            const sevenMinutes = 7 * 60 * 1000;
                            // for
                            const sevenDays = 7 * 24 * 60 * 60 * 1000;
                            const oneWeek = new Date(localDate.valueOf() + sevenMinutes);
                            await lockUserOut(user, oneWeek);
                            return res.status(403).json({
                                message: 'You are locked out for 1 week due to having cancelled twice in a row.',
                            });
                        }
                    }
                    // 4. Guard: Consecutive Unresolved Consultations Lockout
                    if (third) {
                        const threeUnresolved = await verifyThreeUnresolved([
                            first,
                            second,
                            third,
                        ]);
                        if (threeUnresolved) {
                            const oneWeekAgo = localDate;
                            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                            if (first.createdAt > oneWeekAgo) {
                                // for testing
                                const sevenMinutes = 7 * 60 * 1000;
                                // for
                                const sevenDays = 7 * 24 * 60 * 60 * 1000;
                                // Set lock
                                const oneWeek = new Date(localDate.valueOf() + sevenMinutes);
                                await lockUserOut(user, oneWeek);
                                return res.status(403).json({
                                    message: 'You are temporarily locked out due to three unresolved consultations.',
                                });
                            }
                        }
                    }
                    // 5. Guard: 4 Consecutive Cancellation Lockout (one month)
                    if (fourth) {
                        const fourCancelled = await verifyFourCancelled(recentConsultations);
                        if (fourCancelled) {
                            const oneMonthAgo = localDate;
                            oneMonthAgo.setDate(today.getDate() - 30);
                            if (first.createdAt > oneMonthAgo) {
                                const sevenMinutes = 7 * 60 * 1000;
                                // for
                                const thirtyDays = 30 * 24 * 60 * 60 * 1000;
                                // Set lock
                                const oneMonth = new Date(localDate.valueOf() + sevenMinutes);
                                await lockUserOut(user, oneMonth);
                                return res.status(403).json({
                                    message: 'You have been locked out for a month due to four cancelled consultations.',
                                });
                            }
                        }
                        // 6. Guard: 4 consecutive Cancellation Lockout (one month)
                        const fourUnresolved = await verifyFourUnresolved(recentConsultations);
                        if (fourUnresolved) {
                            const oneMonthAgo = localDate;
                            oneMonthAgo.setDate(today.getDate() - 30);
                            if (first.createdAt > oneMonthAgo) {
                                //for testing
                                const sevenMinutes = 7 * 60 * 1000;
                                // for production
                                const thirtyDays = 30 * 24 * 60 * 60 * 1000;
                                // Set lock
                                const oneMonth = new Date(localDate.valueOf() + sevenMinutes);
                                await lockUserOut(user, oneMonth);
                                return res.status(403).json({
                                    message: 'You have been locked out for a month due to four unresolved consultations.',
                                });
                            }
                        }
                    }
                }
            }
            const consultation = {
                userId: user?.user_id,
                selectedDate: selectedDate,
                startTime: startTime,
                endTime: endTime,
                resolutionStatus: 'pending',
                hasRescheduled: false,
                notes: null,
            };
            const newConsultation = await createNewConsultation(consultation);
            return res
                .status(201)
                .json({ message: 'Booking created successfully.', newConsultation });
        }
        catch (err) {
            console.error('[Create Booking Error]', err);
            return res.status(500).json({ message: `Internal server error ${err}.` });
        }
    },
    changeConsultationStatus: async (req, res) => {
        const { consultationId } = req.params;
        const { status } = req.query;
        const allowedStatuses = [
            'pending',
            'confirmed',
            'cancelled',
            'resolved',
            'open',
        ];
        if (!status ||
            typeof status !== 'string' ||
            !allowedStatuses.includes(status)) {
            return res
                .status(400)
                .json({ message: 'Invalid or missing status value.' });
        }
        try {
            const consultation = await getConsultationByPk(consultationId);
            if (!consultation) {
                return res.status(404).json({ message: 'Consultation not found.' });
            }
            consultation.resolutionStatus = status;
            await consultation.save();
            return res.status(200).json({
                message: 'Consultation status updated successfully.',
                updatedStatus: consultation.resolutionStatus,
            });
        }
        catch (err) {
            console.error('[Change Status Error]', err);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    },
    getUserConsultation: async (req, res) => {
        try {
            const consultation = await getUserConsultation(req.user?.user_id);
            if (!consultation) {
                return res.status(404).json({ message: 'No active booking found.' });
            }
            return res.status(200).json({ consultation });
        }
        catch (err) {
            console.error('[Get Booking Error]', err);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    },
    cancelConsultation: async (req, res) => {
        try {
            const consultation = await getActiveConsultation(req.user?.user_id);
            if (!consultation) {
                return res.status(404).json({ message: 'No booking to cancel.' });
            }
            const cancelledConsultation = await cancelActiveConsultation(consultation);
            return res
                .status(200)
                .json({ message: 'Booking cancelled.', cancelledConsultation });
        }
        catch (err) {
            console.error('[Cancel Booking Error]', err);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    },
    rescheduleConsultation: async (req, res) => {
        try {
            const user = req.user;
            const { newDate, newStartTime, newEndTime } = req.body;
            const consultation = await getActiveConsultation(user?.user_id);
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
            const isValidNotice = (0, consultation_utils_1.isWorkingDayNotice)(consultation.selectedDate, now);
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
            if (consultation.selectedDate === newDate &&
                consultation.startTime === newStartTime) {
                return res
                    .status(400)
                    .json({ message: 'This is already your current booking time.' });
            }
            // Update with new time and flag reschedule
            const newConsultation = await rescheduleConsultation(consultation, newDate, newStartTime, newEndTime);
            return res.status(200).json({
                message: 'Your consultation booking has been rescheduled.',
                newConsultation,
            });
        }
        catch (err) {
            console.error('[Reschedule Consultation Booking Error]', err);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    },
    getAvailableDates: async (req, res) => {
        try {
            const user = req.user;
            let isLoggedIn = user;
            const utcDate = new Date();
            const timeZone = req.query.time_zone;
            const today = toZonedTime(utcDate, timeZone);
            const localDateFormatted = format(today, 'yyyy-MM-dd HH:mm:ssXXX', {
                timeZone,
            });
            const month = parseInt(req.query.month, 10); // current month passed in through frontend query params.
            const year = parseInt(req.query.year, 10); // current year passed in through frontend query params.
            const day = today.getMonth() === month - 1 ? today.getDate() : 1;
            let offsetDays = 0;
            if (isNaN(month) || isNaN(year)) {
                return res.status(400).json({ message: 'Invalid query parameters.' });
            }
            //Looped indecision check
            if (isLoggedIn) {
                const attended = await getRecentConsultations(user?.user_id, 2);
                const bothUnresolved = await verifyTwoUnresolved(attended);
                if (bothUnresolved) {
                    offsetDays = 3; // Skip 3 calendar days
                }
            }
            const startDate = new Date(year, month - 1, day + 1); // returns a Date object
            startDate.setDate(startDate.getDate());
            //Dynamically determine how many days in the selected month
            const daysInMonth = new Date(year, month, 0).getDate() - day; // does this get a number?
            const availableDates = (0, consultation_utils_1.generateWorkingDays)(startDate, daysInMonth, offsetDays);
            return res.status(200).json({ availableDates });
        }
        catch (err) {
            console.error('[getAvailableDates Error]', err);
            return res.status(500).json({ message: `Internal server error ${err}.` });
        }
    },
    getAvailableTimeSlots: async (req, res) => {
        try {
            const { date } = req.query;
            const user = req.user;
            const dateString = date ? date : '';
            const dateObj = new Date(dateString);
            if (Date.now() > dateObj.getMilliseconds()) {
                console.log(Date.now());
                console.log(dateObj.getMilliseconds());
                return res.status(402).json({ message: 'date no longer available.' });
            }
            if (!date) {
                return res.status(400).json({ message: 'Date is required.' });
            }
            if (!(0, date_fns_1.isValid)(new Date(dateString))) {
                throw new Error('invalid date format');
            }
            // Fetch confirmed consultations on that date
            const consults = await getConfirmedConsultationsForDate(date);
            // Fetch work sprints on that date
            const sprints = await getWorksprintsForDate(date);
            // Combine consult and sprint blocks into exclusion times
            // Final result: all time slots minus blocked ones
            const availableTimeslots = (0, consultation_utils_1.generateAvailableTimeSlots)(consults, sprints);
            return res.status(200).json({ date, availableTimeslots });
        }
        catch (err) {
            console.error('[getAvailableTimeSlots Error]', err);
            return res.status(500).json({ message: `Internal server error ${err}.` });
        }
    },
};
