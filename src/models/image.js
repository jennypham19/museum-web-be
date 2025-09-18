'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Image extends Model{
        static associate(models) {
            Image.belongsTo(models.Post, {
                foreignKey: 'post_id',
                as: 'imagesPost'
            });
            Image.belongsTo(models.Painting, {
                foreignKey: 'painting_id',
                as: 'imagesPainting'
            })
        }
    };

    Image.init({
        // Cột post_id: khóa ngoại, kiên kết bảng Posts, không được null
        post_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
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
        // Cột painting_id: khóa ngoại, liên kết bảng Paintings, không được null
        painting_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Image'
    });
    
    return Image;
};