'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
      email: { type: Sequelize.STRING, allowNull: false, unique: true},
      password: { type: Sequelize.STRING, allowNull: false},
      full_name: { type: Sequelize.STRING, allowNull: false},
      role: { type: Sequelize.ENUM('admin', 'employee'), allowNull: false, defaultValue: 'employee'},
      phone_number: { type: Sequelize.STRING, allowNull: true},
      avatar_url: { type: Sequelize.STRING, allowNull: true},
      is_active: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1},
      is_change_type: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1},
      createdAt: { type: Sequelize.DATE, allowNull: false},
      updatedAt: { type: Sequelize.DATE, allowNull: false}
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Users')
  }
};
