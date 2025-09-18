'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('PaintingsExhibition', {
      // Cột id: khóa chính, tự tăng, không null
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      // Cột painting_id: khóa ngoại, liên kết Paintings, không null
      painting_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Paintings', key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      // Cột exhibition_id: khóa ngoại, liên kết Exhibitions, không null
      exhibition_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Exhibitions', key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      // Cột createdAt: ngày tạo, kiểu date, không null
      createdAt: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      // Cột updatedAt: ngày cập nhật, kiểu date, không null
      updatedAt: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('PaintingsExhibition')
  }
};
