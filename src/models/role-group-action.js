//model/role-group-action.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class RoleGroupAction extends Model {
        static associate(models){
            RoleGroupAction.belongsTo(models.RoleGroup, {
                foreignKey: 'role_group_id',
                as: 'roleGroup'
            });
            RoleGroupAction.belongsTo(models.MenuAction, {
                foreignKey: 'menu_action_id',
                as: 'menuAction'
            })
        }
    }
    RoleGroupAction.init(
        {
            // Cột role_group_id: khóa ngoại, liên kết bảng RoleGroup, kiểu số, không được phép null
            role_group_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            // Cột menu_action_id: khóa ngoại, liên kết bảng MenuAction, kiểu số, không được phép null
            menu_action_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
        },
        {
            sequelize,
            modelName: 'RoleGroupAction'
        }
    );
    return RoleGroupAction;
}