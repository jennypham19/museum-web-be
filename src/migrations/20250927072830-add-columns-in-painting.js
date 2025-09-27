'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Paintings');
    if(!tableDescription.reason_send){
      await queryInterface.addColumn('Paintings', 'reason_send', {
        type: Sequelize.TEXT,
        allowNull: true
      })
    };
    if(!tableDescription.note) {
      await queryInterface.addColumn('Paintings', 'note', {
        type: Sequelize.TEXT,
        allowNull: true
      })
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Paintings', 'reason_send');
    await queryInterface.removeColumn('Paintings', 'note')
  }
};
