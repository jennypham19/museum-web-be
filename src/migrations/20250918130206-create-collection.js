'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Collections', {
      // Cột id: khóa chính, tự tăng, không được null
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      // Cột name: tên bộ sưu tập, kiểu chuỗi, không được null
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // Cột description: mô tả bộ sưu tập, kiểu text, không được null
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // Cột createdAt: ngày tạo, kiểu date, không null
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      // Cột updatedAt: ngày cập nhật, kiểu date, không null
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Collections')
  }
};
