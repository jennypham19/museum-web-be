'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model{
        static associate(models) {

        }
    }

    User.init({
        email: { type: DataTypes.STRING, allowNull: false, unique: true},
        password: { type: DataTypes.STRING, allowNull: false},
        full_name: { type: DataTypes.STRING, allowNull: false},
        role: {
            type: DataTypes.ENUM('admin', 'employee'),
            allowNull: false,
            defaultValue: 'employee'
        },
        phone_number: { type: DataTypes.STRING, allowNull: true},
        avatar_url: { type: DataTypes.STRING, allowNull: true},
        is_active: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1 // 1: Đã active, 0: Chưa active
        },
        is_change_type: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        }
    }, {
        sequelize,
        modelName: 'User'
    });
    return User;
};