'use strict';
const { addDays, format, isTuesday, isThursday } = require('date-fns');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const workSprints = [];
    const startDate = new Date('2025-06-10');
    const totalDays = 91; // Covers approx 13 weeks

    for (let i = 0; i < totalDays; i++) {
      const current = addDays(startDate, i);
      const isMidBreak =
        (current >= new Date('2025-07-01') &&
          current <= new Date('2025-07-12')) || // 2-week midsem
        (current >= new Date('2025-08-12') &&
          current <= new Date('2025-08-15')); // 1-week study break

      if (!isMidBreak && (isTuesday(current) || isThursday(current))) {
        for (let hour = 13; hour < 17; hour++) {
          const dateStr = format(current, 'yyyy-MM-dd');
          workSprints.push({
            sprint_date: dateStr,
            sprint_start_time: `${hour}:00:00`,
            sprint_end_time: `${hour + 1}:00:00`,
            created_at: new Date(),
            updated_at: new Date(),
          });
        }
      }
    }

    await queryInterface.bulkInsert('work_sprints', workSprints);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('work_sprints', null, {});
  },
};
