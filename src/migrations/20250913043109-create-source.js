'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Sources', {
      // Cột id: khóa chính, kiểu số, tự tăng, không được null
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      // Cột post_id: khóa ngoại, liên kết bảng Posts, không được null
      post_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Posts', key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
      },
      // Cột link_facebook: đường dẫn fb, kiểu chuỗi, có thể null
      link_facebook: {
          type: Sequelize.STRING,
          allowNull: true
      },
      // Cột link_instagram: đường dẫn insta, kiểu chuỗi, có thể null
      link_instagram: {
          type: Sequelize.STRING,
          allowNull: true
      },
      // Cột link_youtube: đường đẫn youtube, kiểu chuỗi, có thể null
      link_youtube: {
          type: Sequelize.STRING,
          allowNull: true
      },
      // Cột link_web: đường dẫn website, kiểu chuỗi, có thể null
      link_web: {
          type: Sequelize.STRING,
          allowNull: true
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
    await queryInterface.dropTable('Sources')
  }
};
