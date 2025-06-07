import { CreationAttributes } from 'sequelize';
// import { Consultation } from '../models/consultation.model';

const { Work_Sprint } = require('../models');
const { Op } = require('sequelize');
import { Consultation } from '../models';
import { ConsultationPayload } from '../types/Consultation';

// Get recent consultations for a user

async function getConsultationByPk(consultationId: number) {
  return Consultation.findByPk(consultationId);
}

// used for consultation check.
async function getRecentConsultations(userId: number, limit = 2) {
  const oneMonthAgo = new Date();
  oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

  return Consultation.findAll({
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

// 📆 Get confirmed consultations for a given date
async function getConfirmedConsultationsForDate(date: string) {
  return require('../models/consultation.model').Consultation.findAll({
    where: {
      selectedDate: date,
      resolutionStatus: { [Op.in]: ['pending', 'confirmed'] },
    },
  });
}

// 💡 Get active consultation (pending or confirmed)
async function getActiveConsultation(userId: number) {
  return require('../models/consultation.model').Consultation.findOne({
    where: {
      user_id: userId,
      resolutionStatus: { [Op.in]: ['pending', 'confirmed'] },
    },
  });
}

async function getAttendedConsultations(
  userId: number,
  timeFrameInDays: number,
  limit = 2
) {
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

async function getUserConsultation(userId: number) {
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
  getConsultationByPk,
  getRecentConsultations,
  getConfirmedConsultationsForDate,
  getActiveConsultation,
  getAttendedConsultations,
  getUserConsultation,
  rescheduleConsultation,
  createNewConsultation,
};
