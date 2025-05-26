import { CreationAttributes } from 'sequelize';
// import { Consultation } from '../models/consultation.model';

const { Work_Sprint } = require('../models');
const { Op, CreationAttributes } = require('sequelize');
import { ConsultationPayload } from '../types/Consultation';

// Get recent consultations for a user

async function getRecentConsultations(userId: number, limit = 2) {
  return require('../models/Consultation.model').Consultation.findAll({
    where: { user_id: userId },
    order: [['created_at', 'DESC']],
    limit,
  });
}

// 🔍 Get user's recent attended consultations (for indecision check)
async function getRecentAttendedConsultations(userId: number, limit = 2) {
  return require('../models/consultation.model').Consultation.findAll({
    where: { user_id: userId, status: 'attended' },
    order: [['created_at', 'DESC']],
    limit,
  });
}

// 📆 Get confirmed consultations for a given date
async function getConfirmedConsultationsForDate(date: string) {
  return require('../models/consultation.model').Consultation.findAll({
    where: {
      selectedDate: date,
      status: 'confirmed',
    },
  });
}

// ⏱ Get work sprints for a given date
async function getWorkSprintsForDate(date: string) {
  return require('../models/worksprint.model').WorkSprint.findAll({
    where: { sprint_date: date },
  });
}

// 💡 Get active consultation (pending or confirmed)
async function getActiveConsultation(userId: number) {
  return require('../models/consultation.model').Consultation.findOne({
    where: {
      user_id: userId,
      status: { [Op.in]: ['pending', 'confirmed'] },
    },
  });
}

async function getAttendedConsultations(userId: number, limit = 2) {
  return require('../models/consultation.model').Consultation.findAll({
    where: {
      user_id: userId,
      status: 'attended',
    },
    order: [['created_at', 'DESC']],
    limit,
  });
}

async function getUserConsultation(userId: number) {
  return require('../models/consultation.model').Consultation.findOne({
    where: {
      user_id: userId,
      status: { [Op.in]: ['pending', 'confirmed', 'attended', 'cancelled'] },
    },
  });
}

//  Create a new consultation
async function createNewConsultation(
  consultationData: CreationAttributes<
    import('../models/consultation.model').Consultation
  >
) {
  return require('../models/consultation.model').Consultation.create(
    consultationData
  );
}

async function rescheduleConsultation(
  consultation: import('../models/consultation.model').Consultation,
  newDate: string,
  newStartTime: string,
  newEndTime: string
) {
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
