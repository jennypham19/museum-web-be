'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Tokens', {
      id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
      token: { type: Sequelize.STRING, allowNull: false, unique: true},
      type: { type: Sequelize.STRING, allowNull: false},
      expires: { type: Sequelize.DATE, allowNull: false},
      blacklisted: { type: Sequelize.BOOLEAN, defaultValue: false},
      // Khóa ngoại tới bảng Users
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: { type: Sequelize.DATE, allowNull: false},
      updatedAt: { type: Sequelize.DATE, allowNull: false}
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Tokens')
  }
};
