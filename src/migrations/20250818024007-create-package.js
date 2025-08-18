'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Packages', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
      title: { type: Sequelize.STRING, allowNull: false},
      price: { type: Sequelize.STRING, allowNull: false},
      members: { type: Sequelize.INTEGER, allowNull: false},
      guests: { type: Sequelize.INTEGER, allowNull: false},
      includes: { type: Sequelize.STRING, allowNull: false},
      benefits: { type: Sequelize.STRING, allowNull: false},
      createdAt: { type: Sequelize.DATE, allowNull: false},
      updatedAt: { type: Sequelize.DATE, allowNull: false}
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Packages')
  }
};
