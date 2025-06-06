"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { Consultation } from '../models/consultation.model';
const { Work_Sprint } = require('../models');
const { Op, CreationAttributes } = require('sequelize');
const models_1 = require("../models");
// Get recent consultations for a user
async function getConsultationByPk(consultationId) {
    return models_1.Consultation.findByPk(consultationId);
}
// used for consultation check.
async function getRecentConsultations(userId, limit = 2) {
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
    return models_1.Consultation.findAll({
        where: {
            userId: userId,
            createdAt: {
                [Op.gte]: oneMonthAgo,
            },
        },
        order: [['created_at', 'DESC']],
        limit,
    });
}
// // 🔍 Get user's recent attended consultations (for indecision check)
// async function getRecentAttendedConsultations(userId: number, limit = 2) {
//   const oneMonthAgo = new Date();
//   oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
//   return require('../models/consultation.model').Consultation.findAll({
//     where: { user_id: userId, resolutionStatus: 'attended' },
//     order: [['created_at', 'DESC']],
//     limit,
//   });
// }
// 📆 Get confirmed consultations for a given date
async function getConfirmedConsultationsForDate(date) {
    return require('../models/consultation.model').Consultation.findAll({
        where: {
            selectedDate: date,
            resolutionStatus: 'confirmed',
        },
    });
}
// ⏱ Get work sprints for a given date
async function getWorkSprintsForDate(date) {
    return require('../models/worksprint.model').WorkSprint.findAll({
        where: { sprint_date: date },
    });
}
// 💡 Get active consultation (pending or confirmed)
async function getActiveConsultation(userId) {
    return require('../models/consultation.model').Consultation.findOne({
        where: {
            user_id: userId,
            resolutionStatus: { [Op.in]: ['pending', 'confirmed'] },
        },
    });
}
async function getAttendedConsultations(userId, timeFrameInDays, limit = 2) {
    const xDaysAgo = new Date();
    xDaysAgo.setDate(xDaysAgo.getDate() - timeFrameInDays);
    return require('../models/consultation.model').Consultation.findAll({
        where: {
            user_id: userId,
            resolutionStatus: { [Op.in]: ['open', 'resolved'] },
            createdAt: {
                [Op.gte]: xDaysAgo,
            },
        },
        order: [['created_at', 'DESC']],
        limit,
    });
}
async function getUserConsultation(userId) {
    return require('../models/consultation.model').Consultation.findOne({
        where: {
            user_id: userId,
            resolutionStatus: {
                [Op.in]: ['pending', 'confirmed', 'cancelled', 'open', 'resolved'],
            },
        },
    });
}
//  Create a new consultation
async function createNewConsultation(consultationData) {
    return require('../models/consultation.model').Consultation.create(consultationData);
}
async function rescheduleConsultation(consultation, newDate, newStartTime, newEndTime) {
    consultation.selectedDate = newDate;
    consultation.startTime = newStartTime;
    consultation.endTime = newEndTime;
    consultation.hasRescheduled = true;
    return consultation.save();
}
module.exports = {
    getConsultationByPk,
    getRecentConsultations,
    getConfirmedConsultationsForDate,
    getWorkSprintsForDate,
    getActiveConsultation,
    getAttendedConsultations,
    getUserConsultation,
    rescheduleConsultation,
    createNewConsultation,
};
