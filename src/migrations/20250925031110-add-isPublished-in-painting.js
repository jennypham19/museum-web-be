'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Paintings');
    if(!tableDescription.is_published) {
      await queryInterface.addColumn('Paintings', 'is_published', {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }) 
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Paintings', 'is_published')
  }
};
