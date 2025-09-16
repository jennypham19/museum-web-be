'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Posts');
    if(!tableDescription.author_id) {
      await queryInterface.addColumn('Posts', 'author_id', {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      })
    } 
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Posts', 'author_id')
  }
};
