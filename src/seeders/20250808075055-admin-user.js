'use strict';
const bcrypt = require('bcryptjs');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableName = 'Users';
    const adminEmail = 'admin@gmail.com';

    const existingAdmin = await queryInterface.sequelize.query(
      `SELECT email FROM "${tableName}" WHERE email = :email LIMIT 1`,
      {
        replacements: { email: adminEmail},
        type: Sequelize.QueryTypes.SELECT,
        plain: true
      }
    );

    if(!existingAdmin) {
      //Băm mật khẩu
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('123456', salt);

      await queryInterface.bulkInsert(tableName, [{
        email: adminEmail,
        password: hashedPassword,
        full_name: 'Quản trị viên',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});

      console.log(`Successfully inserted initial admin user: '${adminEmail}'`);
    }else{
      console.log(`Initial admin user '${adminEmail}' already exists. Skipping.`);
    }
  },

  async down (queryInterface, Sequelize) {
    // Giữ nguyên logic down, nó đã đúng
    await queryInterface.bulkDelete('Users', { email: 'admin@gmail.com'});
    console.log(`Successfully deleted initial admin user: 'admin@gmail.com'`);
  }
};
