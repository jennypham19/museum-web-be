'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Information extends Model {
        static associate(models) {
            Information.belongsTo(models.Package, {
                foreignKey: 'id_package',
                as: 'package'
            });
            Information.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'user'
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
        },
        // Cột date_registered: ngày đăng ký của khách hàng, kiểu date và không được phép null
        date_registered: {
            type: DataTypes.DATE,
            allowNull: false
        },
        // Cột date_expired: ngày hết hạn của gói mà khách hàng đăng ký (thường là 1 tháng), kiểu date và không được phép null
        date_expired: {
            type: DataTypes.DATE,
            allowNull: false
        },
        // Cột user_id: khóa ngoại, liên kết đến bảng Users, được phép null tại bảng này sẽ chứa thông tin của 2 loại khách: khách tự do và khách có tài khoản, thông tin của khách có
        // tài khoản được lưu ở bảng Users
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    }, {
        sequelize,
        modelName: 'Information'
    });
    return Information;
}