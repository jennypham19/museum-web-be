//model/user-role.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class UserRole extends Model {
        static associate(models){
            UserRole.belongsTo(models.RoleGroup, {
                foreignKey: 'role_group_id',
                as: 'roleGroup'
            });
            UserRole.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'user'
            })
        }
    }
    UserRole.init(
        {
            // Cột role_group_id: khóa ngoại, liên kết bảng RoleGroup, kiểu số, không được phép null
            role_group_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            // Cột user_id: khóa ngoại, liên kết bảng User, kiểu số, không được phép null
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
        },
        {
            sequelize,
            modelName: 'UserRole'
        }
    );
    return UserRole;
}