'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model{
        static associate(models) {
            User.hasOne(models.Information, {
                foreignKey: 'user_id',
                as: 'userInformation'
            }),
            User.hasMany(models.Post, {
                foreignKey: 'author_id',
                as: 'userPost'
            }),
            User.hasOne(models.UserRole, {
                foreignKey: 'user_id',
                as:'users'
            })
        }
    }

    User.init({
        email: { type: DataTypes.STRING, allowNull: false, unique: true},
        password: { type: DataTypes.STRING, allowNull: false},
        full_name: { type: DataTypes.STRING, allowNull: false},
        role: {
            type: DataTypes.ENUM('admin', 'employee', 'member', 'guest', 'mod'),
            allowNull: false,
            defaultValue: 'member'
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
            defaultValue: 1 // 1: Chưa đổi mật khẩu, 0: Đã đổi mật khẩu
        }
    }, {
        sequelize,
        modelName: 'User'
    });
    return User;
};