'use strict';
const { Model, DATE } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class MenuAction extends Model {
        static associate(models) {
            MenuAction.belongsTo(models.Menu, {
                foreignKey: 'menu_id',
                as: 'menu'
            });
            MenuAction.belongsTo(models.Action, {
                foreignKey: 'action_id',
                as: 'action'
            })
        }
    }

    MenuAction.init({
        // Cột menu_id: khóa ngoại, liên kết đến bảng Menu, không được null
        menu_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        // Cột action_id: khóa ngoại, liên kết đến bảng Action, không được null
        action_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        // Cột code: mã hành động của menu, kiểu chuỗi, không được phép null
        code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Cột name: tên hành động của menu, kiểu chuỗi, không được phép null
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'MenuAction'
    });

    return MenuAction;
}