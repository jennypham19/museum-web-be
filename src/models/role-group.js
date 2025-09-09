'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class RoleGroup extends Model {
        static associate(models) {
            RoleGroup.hasMany(models.RoleGroupMenu, {
                foreignKey: 'role_group_id',
                as: 'roleGroupMenu'
            });
            RoleGroup.hasMany(models.RoleGroupAction, {
                foreignKey: 'role_group_id',
                as: 'roleGroupAction'
            });
            RoleGroup.hasMany(models.UserRole, {
                foreignKey: 'role_group_id',
                as: 'roleGroupUser'
            })
        }
    }

    RoleGroup.init({
        // Cột name: tên nhóm quyền, kiểu chuỗi, không được phép null
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'RoleGroup'
    });

    return RoleGroup;
}