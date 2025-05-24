"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const consultation_model_1 = require("../models/consultation.model");
const { Work_Sprint } = require('../models');
const { Op } = require('sequelize');
// Get recent consultations for a user
async function getRecentConsultations(userId, limit = 2) {
    return consultation_model_1.Consultation.findAll({
        where: { user_id: userId },
        order: [['created_at', 'DESC']],
        limit,
    });
}
// 🔍 Get user's recent attended consultations (for indecision check)
async function getRecentAttendedConsultations(userId, limit = 2) {
    return consultation_model_1.Consultation.findAll({
        where: { user_id: userId, status: 'attended' },
        order: [['created_at', 'DESC']],
        limit,
    });
}
// 📆 Get confirmed consultations for a given date
async function getConfirmedConsultationsForDate(date) {
    return consultation_model_1.Consultation.findAll({
        where: {
            selectedDate: date,
            status: 'confirmed',
        },
    });
}
// ⏱ Get work sprints for a given date
async function getWorkSprintsForDate(date) {
    return Work_Sprint.findAll({
        where: { sprint_date: date },
    });
}
// 💡 Get active consultation (pending or confirmed)
async function getActiveConsultation(userId) {
    return consultation_model_1.Consultation.findOne({
        where: {
            user_id: userId,
            status: { [Op.in]: ['pending', 'confirmed'] },
        },
    });
}
async function getAttendedConsultations(userId, limit = 2) {
    return consultation_model_1.Consultation.findAll({
        where: {
            user_id: userId,
            status: 'attended',
        },
        order: [['created_at', 'DESC']],
        limit,
    });
}
async function getUserConsultation(userId) {
    return consultation_model_1.Consultation.findOne({
        where: {
            user_id: userId,
            status: { [Op.in]: ['pending', 'confirmed', 'attended', 'cancelled'] },
        },
    });
}
//  Create a new consultation
async function createNewConsultation(consultationData) {
    return consultation_model_1.Consultation.create(consultationData);
}
async function rescheduleConsultation(consultation, newDate, newStartTime, newEndTime) {
    consultation.selectedDate = newDate;
    consultation.startTime = newStartTime;
    consultation.endTime = newEndTime;
    consultation.hasRescheduled = true;
    return consultation.save();
}
module.exports = {
    getRecentConsultations,
    getRecentAttendedConsultations,
    getConfirmedConsultationsForDate,
    getWorkSprintsForDate,
    getActiveConsultation,
    getAttendedConsultations,
    getUserConsultation,
    rescheduleConsultation,
    createNewConsultation,
};
