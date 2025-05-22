'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('consultations', 'start_time', {
      type: Sequelize.TIME,
      allowNull: true,
    });
    await queryInterface.addColumn('consultations', 'end_time', {
      type: Sequelize.TIME,
      allowNull: true,
    });
    await queryInterface.removeColumn('consultations', 'selected_time');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('consultations', 'start_time');
    await queryInterface.removeColumn('consultations', 'end_time');
  },
};
