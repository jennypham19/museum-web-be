'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Events');
    if(!tableDescription.name_image) {
      await queryInterface.addColumn('Events', 'name_image', {
        type: Sequelize.STRING,
        allowNull: true
      })
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Events', 'name_image');
  }
};
