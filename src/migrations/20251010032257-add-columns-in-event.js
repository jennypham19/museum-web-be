'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Events');
    if(!tableDescription.rejection_reason){
      await queryInterface.addColumn('Events','rejection_reason', {
        type: Sequelize.TEXT,
        allowNull: true
      })
    };
    if(!tableDescription.is_published) {
      await queryInterface.addColumn('Events', 'is_published', {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      })
    };
    if(!tableDescription.reason_send) {
      await queryInterface.addColumn('Events', 'reason_send', {
        type: Sequelize.STRING,
        allowNull: true
      })
    };
    if(!tableDescription.note) {
      await queryInterface.addColumn('Events', 'note', {
        type: Sequelize.TEXT,
        allowNull: true
      })
    };
    if(!tableDescription.user_id_approve) {
      await queryInterface.addColumn('Events', 'user_id_approve', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users', key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      })
    };
    if(!tableDescription.user_id_send) {
      await queryInterface.addColumn('Events', 'user_id_send', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users', key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      })
    };
    if(!tableDescription.curator_id) {
      await queryInterface.addColumn('Events', 'curator_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users', key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      })
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Events', 'rejection_reason');
    await queryInterface.removeColumn('Events', 'is_published');
    await queryInterface.removeColumn('Events', 'reason_send');
    await queryInterface.removeColumn('Events', 'note');
    await queryInterface.removeColumn('Events', 'user_id_approve');
    await queryInterface.removeColumn('Events', 'user_id_send');
    await queryInterface.removeColumn('Events', 'curator_id');
  }
};
