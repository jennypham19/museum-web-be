'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Paintings');
    if(!tableDescription.name_image) {
      await queryInterface.addColumn('Paintings', 'name_image', {
        type: Sequelize.STRING,
        allowNull: true
      })
    } 
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Paintings', 'name_image')
  }
};
