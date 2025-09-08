'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Menus');
    if(!tableDescription.parent_code) {
      await queryInterface.addColumn('Menus', 'parent_code', {
        allowNull: true,
        type: Sequelize.STRING
      })
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Menus', 'parent_code')
  }
};
