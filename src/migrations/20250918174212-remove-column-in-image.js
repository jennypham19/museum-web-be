'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Images');
    if(tableDescription.post_id){
      await queryInterface.removeColumn('Images', 'post_id');
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('Images', 'post_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Posts', key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'NOT NULL'
    })
  }
};
