'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Package extends Model{
        static associate(models) {
            Package.hasMany(models.Information, {
                foreignKey: 'id_package',
                as: 'informations'
            })
        }
    }

    Package.init({
        // Cột title: tiêu đề gói, kiểu chuỗi, không được phép null
        title: { 
            type: DataTypes.STRING, 
            allowNull: false
        },
        // Cột price: giá của gói, kiểu chuỗi, không được phép null
        price: { 
            type: DataTypes.STRING, 
            allowNull: false
        },
        // Cột members: số lượng thành viên của gói, kiểu số và không được phép null
        members: { 
            type: DataTypes.INTEGER, 
            allowNull: false
        },
        // Cột guests: số lượng khách của gói, kiểu số và không được phép null
        guests: { 
            type: DataTypes.INTEGER, 
            allowNull: false
        },
        // Cột includes: số lượng người tham gia của gói, kiểu chuỗi và không được phép null
        includes: { 
            type: DataTypes.STRING, 
            allowNull: false
        },
        // Cột benefits: quyền lợi của gói, kiểu chuỗi và không được phép null
        benefits: { 
            type: DataTypes.STRING, 
            allowNull: false
        },
    }, {
        sequelize,
        modelName: 'Package'
    });
    return Package;
}