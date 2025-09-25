'use strict'
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Painting extends Model{
        static associate(models) {
            Painting.hasMany(models.ImagePainting, {
                foreignKey: 'painting_id',
                as: 'paintingImage'
            }),
            Painting.hasMany(models.PaintingCollection, {
                foreignKey: 'painting_id',
                as: 'paintingsCollection'
            }),
            Painting.hasMany(models.PaintingExhibition, {
                foreignKey: 'painting_id',
                as: 'paintingsExhibition'
            })
        }
    };

    Painting.init({
        // Cột name: tên tác phẩm, kiểu chuỗi, không được null
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Cột author: tác giả tác phẩm, kiểu chuỗi, không được null
        author: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Cột period: thời kỳ tác phẩm, kiểu chuỗi, không được null
        period: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Cột image_url: hình ảnh của tác phẩm, kiểu chuỗi, không được null
        image_url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Cột description: mô tả tác phẩm, kiểu text, không được null
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        // Cột status: trạng thái của tác phẩm, kiểu enum, không được null
        status: {
            type: DataTypes.ENUM('created','pending', 'reviewing', 'approved', 'rejected'),
            allowNull: false,
            defaultValue: 'created'
        },
        // Cột rejectionReason: lý do từ chối không duyệt, kiểu text, có thể null
        rejection_reason: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        // Cột is_published: đăng tải, kiểu boolean
        is_published: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        sequelize,
        modelName: 'Painting'
    });
    return Painting;
};