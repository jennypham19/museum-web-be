//model/role-group-menu.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class RoleGroupMenu extends Model {
        static associate(models){
            RoleGroupMenu.belongsTo(models.RoleGroup, {
                foreignKey: 'role_group_id',
                as: 'roleGroupMenu'
            });
            RoleGroupMenu.belongsTo(models.Menu, {
                foreignKey: 'menu_id',
                as: 'menu'
            })
        }
    }
    RoleGroupMenu.init(
        {
            // Cột role_group_id: khóa ngoại, liên kết bảng RoleGroup, kiểu số, không được phép null
            role_group_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            // Cột menu_id: khóa ngoại, liên kết bảng Menu, kiểu số, không được phép null
            menu_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
        },
        {
            sequelize,
            modelName: 'RoleGroupMenu'
        }
    );
    return RoleGroupMenu;
}