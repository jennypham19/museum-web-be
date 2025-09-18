'use strict'
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Collection extends Model {
        static associate(models) {
            Collection.hasMany(models.Painting, {
                foreignKey: 'collection_id',
                as: 'collectionPaintings'
            });
            Collection.belongsTo(models.Exhibition, {
                foreignKey: 'exhibition_id',
                as: 'exhibitionCollections'
            })
        }
    };

    Collection.init({
        // Cột name: tên bộ sưu tập, kiểu chuỗi, không được null
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Cột description: mô tả bộ sưu tập, kiểu text, không được null
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        // Cột exhibition_id: khóa ngoại, liên kết bảng Exhibitions, không được null
        exhibition_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Collection'
    });
    return Collection;
};