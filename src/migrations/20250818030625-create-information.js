'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Informations', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      full_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // Khóa ngoại tới bảng Packages
      id_package: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Packages', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: { type: Sequelize.DATE, allowNull: false},
      updatedAt: { type: Sequelize.DATE, allowNull: false}
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Informations')
  }
};
