'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Collections');
    // name_image: tên của anh chính, kiểu chuỗi, không null
    if(!tableDescription.name_image) {
      await queryInterface.addColumn('Collections', 'name_image',{
        type: Sequelize.STRING,
        allowNull: false 
      })
    };
    // image_url: đường dẫn ảnh, kiểu chuỗi, không null
    if(!tableDescription.image_url){
      await queryInterface.addColumn('Collections', 'image_url', {
        type: Sequelize.STRING,
        allowNull: false
      })
    }
    //status: trạng thái của bộ sưu tập, kiểu enum, không null, giá trị mặc định là created
    if(!tableDescription.status) {
      await queryInterface.addColumn('Collections', 'status', {
        type: Sequelize.ENUM('created','pending', 'reviewing', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'created'
      })
    }
    // tags: chủ đề của tác phẩm, kiểu chuỗi, không null
    if(!tableDescription.tags) {
      await queryInterface.addColumn('Collections', 'tags', {
        type: Sequelize.STRING,
        allowNull: false
      })
    }
    // rejection_reason: lý do từ chối, kiểu text, có thể null
    if(!tableDescription.rejection_reason) {
      await queryInterface.addColumn('Collections', 'rejection_reason', {
        type: Sequelize.STRING,
        allowNull: true
      })
    }
    // is_published: đăng tải, kiểu boolean, giá trị mặc định là false
    if(!tableDescription.is_published) {
      await queryInterface.addColumn('Collections', 'is_published', {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      })
    }
    // reason_send: lý do gửi lên trên, kiểu chuỗi, có thể null
    if(!tableDescription.reason_send){
      await queryInterface.addColumn('Collections', 'reason_send', {
        type: Sequelize.STRING,
        allowNull: true
      })
    }
    // note: ghi chú nếu là lý do khác, kiểu text, có thể null
    if(!tableDescription.note) {
      await queryInterface.addColumn('Collections', 'note', {
        type: Sequelize.STRING,
        allowNull: true
      })
    }
    // Cột user_id_approve: id người duyệt (kiểm duyệt viên hoặc quản trị viên), kiểu số, có thể null
    if(!tableDescription.user_id_approve) {
      await queryInterface.addColumn('Collections', 'user_id_approve', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users', key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      })
    }
    // Cột user_id_send: id người gửi (kiểm duyệt viên), kiểu số, có thể null
    if(!tableDescription.user_id_send) {
      await queryInterface.addColumn('Collections', 'user_id_send', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Users', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      })
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Collections', 'name_image');
    await queryInterface.removeColumn('Collections', 'image_url');
    await queryInterface.removeColumn('Collections', 'status');
    await queryInterface.removeColumn('Collections', 'tags');
    await queryInterface.removeColumn('Collections', 'rejection_reason');
    await queryInterface.removeColumn('Collections', 'is_published');
    await queryInterface.removeColumn('Collections', 'reason_send');
    await queryInterface.removeColumn('Collections', 'note');
    await queryInterface.removeColumn('Collections', 'user_id_approve');
    await queryInterface.removeColumn('Collections', 'user_id_send');
  }
};
