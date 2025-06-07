'use strict';

/** @type {import('sequelize-cli').Migration} */
const { addDays, format, isTuesday, isThursday } = require('date-fns');

module.exports = {
  async up(queryInterface, Sequelize) {
    const consultations = [];
    const startDate = new Date('2025-05-27'); // First Tuesday after the seed date
    const totalDays = 91; // Covers approx 13 weeks

    for (let i = 0; i < totalDays; i++) {
      const current = addDays(startDate, i);
      const isMidBreak =
        (current >= new Date('2025-06-24') &&
          current <= new Date('2025-07-05')) || // 2-week midsem
        (current >= new Date('2025-08-12') &&
          current <= new Date('2025-08-15')); // 1-week study break

      if (!isMidBreak && (isTuesday(current) || isThursday(current))) {
        for (let hour = 13; hour < 17; hour++) {
          const dateStr = format(current, 'yyyy-MM-dd');
          consultations.push({
            name: 'John Doe',
            email: 'john.doe002@gmail.com',
            selected_date: dateStr,
            start_time: `${hour}:00:00`,
            end_time: `${hour + 1}:00:00`,
            status: 'confirmed',
            resolution_status: 'open',
            has_rescheduled: false,
            notes: null,
            created_at: new Date(),
            updated_at: new Date(),
          });
        }
      }
    }

    await queryInterface.bulkInsert('consultations', consultations);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('consultations', {
      created_at: '2025-05-21 09:35:47.247+00',
    });
  },
};
