'use strict'
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Painting extends Model{
        static associate(models) {
            Painting.hasMany(models.Image, {
                foreignKey: 'painting_id',
                as: 'imagesPainting'
            });
            Painting.belongsTo(models.Exhibition, {
                foreignKey: 'exhibition_id',
                as: 'exhibitionPaintings'
            });
            Painting.belongsTo(models.Collection, {
                foreignKey: 'collection_id',
                as: 'collectionPaintings'
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
        // Cột collection_id: khóa ngoại, liên kết bảng Collections, không được null
        collection_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        // Cột exhibition_id: khóa ngoại, liên kết bảng Exhibitions, không được null
        exhibition_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }

    }, {
        sequelize,
        modelName: 'Painting'
    });
    return Painting;
};