'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class RoleGroup extends Model {

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