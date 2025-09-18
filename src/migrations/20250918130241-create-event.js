'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Events', {
      // Cột id: khóa chính, tự tăng, không null
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      // Cột name: tên sự kiện, kiểu chuỗi, không được null
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // Cột description: mô tả, kiểu text, không được phép null
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      // Cột start_date: ngày bắt đầu, kiểu date, không được null
      start_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      // Cột end_date: ngày kết thúc, kiểu date, không được null
      end_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      // Cột open_time: giờ mở cửa sự kiện, kiểu chuỗi, không được null
      open_time: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // Cột close_time: giờ đóng cửa sự kiện, kiểu chuỗi, không được null
      close_time: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // Cột image_url: ảnh của sự kiện, kiểu chuỗi, không được null
      image_url: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // Cột topic: chủ đề của sự kiện
      topic: {
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
    await queryInterface.dropTable('Events')
  }
};
