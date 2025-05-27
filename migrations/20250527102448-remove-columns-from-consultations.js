'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('consultations', 'name');
    await queryInterface.removeColumn('consultations', 'email');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('consultations', 'name', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('consultations', 'email', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
