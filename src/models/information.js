'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Information extends Model {
        static associate(models) {
            Information.belongsTo(models.Package, {
                foreignKey: 'id_package',
                as: 'package'
            })
        }
    }

    Information.init({
        // Cột fullname: tên của người đăng ký gói, kiểu chuỗi và không được phép null
        full_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Cột email: email của người đăng ký, kiểu chuỗi và không được phép null
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Cột phone: số điện thoại của người đăng ký, kiểu chuỗi và không được phép null
        phone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Cột id_package: khóa ngoại, liên kết đến bảng Packages, không được null
        id_package: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Information'
    });
    return Information;
}