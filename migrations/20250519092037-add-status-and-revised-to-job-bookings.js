'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('job_bookings', 'status', {
      type: Sequelize.ENUM('booked', 'in_progress', 'revision', 'completed'),
      defaultValue: 'booked',
    });
    await queryInterface.addColumn('job_bookings', 'revised', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('job_bookings', 'status');
    await queryInterface.removeColumn('job_bookings', 'revised');
  },
};
