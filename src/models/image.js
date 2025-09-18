'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Image extends Model{
        static associate(models) {
            Image.hasMany(models.ImagePainting, {
                foreignKey: 'image_id',
                as: 'imagePainting'
            })
        }
    };

    Image.init({
        // Cột name: tên ảnh, kiểu chuỗi, không được null
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Cột url: đường dẫn ảnh, kiểu chuỗi, không được null
        url: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        sequelize,
        modelName: 'Image'
    });
    
    return Image;
};