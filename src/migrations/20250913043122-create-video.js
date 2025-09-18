'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Videos', {
      // Cột id: khóa chính, kiểu số, tự tăng, không được null
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      // Cột name: tên video, kiểu chuỗi, không được null
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // Cột url: đường dẫn video, kiểu chuỗi, không được null
      url: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // Cột createdAt: ngày tạo, kiểu date, được null
      createdAt: { 
        type: Sequelize.DATE, 
        allowNull: false
      },
      // Cột updatedAt: ngày tạo, kiểu date, được null
      updatedAt: { 
        type: Sequelize.DATE, 
        allowNull: false
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Videos')
  }
};
