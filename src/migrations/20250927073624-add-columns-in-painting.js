'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Paintings');
    if(!tableDescription.user_id_approve) {
      await queryInterface.addColumn('Paintings', 'user_id_approve', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Users', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      })
    };
    if(!tableDescription.user_id_send) {
      await queryInterface.addColumn('Paintings', 'user_id_send', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Users', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      })
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Paintings', 'user_id_approve');
    await queryInterface.removeColumn('Paintings', 'user_id_send');
  }
};
