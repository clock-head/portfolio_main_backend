'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('consultations', 'status');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('consultations', 'status');
  },
};
