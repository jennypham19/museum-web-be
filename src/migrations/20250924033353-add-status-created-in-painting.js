'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 1. Thêm giá trị 'created' vào enum (nếu chưa có)
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_Paintings_status" ADD VALUE IF NOT EXISTS 'created';
    `);

    // 2. Đổi defaultValue của cột status thành 'created'
    await queryInterface.changeColumn('Paintings', 'status', {
      type: Sequelize.ENUM('created', 'pending', 'reviewing', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'created'
    })
  },

  async down (queryInterface, Sequelize) {
    // ⚠️ PostgreSQL không cho xóa trực tiếp enum value
    // nên rollback chỉ đổi defaultValue về 'pending'
    await queryInterface.changeColumn('Paintings', 'status', {
      type: Sequelize.ENUM('pending', 'reviewing', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending'
    })
  }
};
