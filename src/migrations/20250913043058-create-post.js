'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.createTable('Posts', {
        // Cột id: mã của bài viết, kiểu số, khóa chính, tự động tăng, không được null
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        // Cột category: thể loại, kiểu số, không được phép null
        category: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        // Cột date: ngày tạo bài viết, kiểu date, không được null
        date: {
            type: Sequelize.DATE,
            allowNull: false
        },
        // Cột title: Tiêu đề, kiểu chuỗi, không được null
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        // Cột summary: tóm tắt, kiểu text, không được null
        summary: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        // Cột author: tác giả, kiểu chuỗi, không được null
        author: {
            type: Sequelize.STRING,
            allowNull: false
        },
        // Cột period: thời kỳ, kiểu chuỗi, không được null
        period: {
            type: Sequelize.STRING,
            allowNull: false
        },
        // Cột name_url: tên ảnh, kiểu chuỗi, được phép null
        name_url: {
            type: Sequelize.STRING,
            allowNull: true
        },
        // Cột image_url: đường dẫn ảnh, kiểu chuỗi và không được phép null
        image_url: {
            type: Sequelize.STRING,
            allowNull: false
        },
        // Cột content: nội dung, kiểu text, không được null
        content: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        // Cột status: trạng thái bài viết, kiểu enum, không được null
        status: {
            type: Sequelize.ENUM('pending', 'approved', 'rejected'),
            allowNull: false,
            defaultValue: 'pending'
        },
        // Cột is_published: trạng thái đăng tải, kiểu boolean, không được phép null
        is_published: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        // Cột rejection_reason: lý do từ chối, kiểu chuỗi, có thể null
        rejection_reason: {
            type: Sequelize.STRING,
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
    await queryInterface.dropTable('Posts')
  }
};
