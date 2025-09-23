'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Paintings');
    if(!tableDescription.status) {
      await queryInterface.addColumn('Paintings', 'status', {
        type: Sequelize.ENUM('pending', 'reviewing', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending'
      })
    };
    if(!tableDescription.rejection_reason) {
      await queryInterface.addColumn('Paintings', 'rejection_reason', {
        type: Sequelize.TEXT,
        allowNull: true
      })
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Paintings', 'status');
    await queryInterface.removeColumn('Paintings', 'rejection_reason');
  }
};
