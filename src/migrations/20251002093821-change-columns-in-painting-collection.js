'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('PaintingsCollection');
    // Xoá cột cũ
    if(tableDescription.createdAt){
      await queryInterface.removeColumn('PaintingsCollection', 'createdAt');
    }
    if(tableDescription.updatedAt){
      await queryInterface.removeColumn('PaintingsCollection', 'updatedAt');
    }
    
    // Thêm lại cột với Sequelize.DATE
    await queryInterface.addColumn('PaintingsCollection', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });

    await queryInterface.addColumn('PaintingsCollection', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });

  },

  async down (queryInterface, Sequelize) {
    // Xoá cột cũ
    if(tableDescription.createdAt){
      await queryInterface.removeColumn('PaintingsCollection', 'createdAt');
    }
    if(tableDescription.updatedAt){
      await queryInterface.removeColumn('PaintingsCollection', 'updatedAt');
    }

    // Thêm lại cột kiểu INTEGER (epoch)
    await queryInterface.addColumn('PaintingsCollection', 'createdAt', {
      type: Sequelize.INTEGER,
      allowNull: false
    });

    await queryInterface.addColumn('PaintingsCollection', 'updatedAt', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
  }
};
