'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Collections');
    // Cột curator_id: id người phụ trách (người thêm mới tác phẩm), kiểu số, có thể null
    if(!tableDescription.curator_id){
      await queryInterface.addColumn('Collections', 'curator_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      })
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Collections', 'curator_id');
  }
};
