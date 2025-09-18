'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Paintings', {
      // Cột id: khóa chính, tự tăng, không null
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      // Cột name: tên tác phẩm, kiểu chuỗi, không được null
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // Cột author: tác giả tác phẩm, kiểu chuỗi, không được null
      author: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // Cột period: thời kỳ tác phẩm, kiểu chuỗi, không được null
      period: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // Cột image_url: hình ảnh của tác phẩm, kiểu chuỗi, không được null
      image_url: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // Cột description: mô tả tác phẩm, kiểu text, không được null
      description: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable('Paintings');
  }
};
