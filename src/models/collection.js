'use strict'
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Collection extends Model {
        static associate(models) {
            Collection.hasOne(models.PaintingCollection, {
                foreignKey: 'collection_id',
                as: 'collectionPaintings'
            }),
            Collection.hasMany(models.CollectionExhibition, {
                foreignKey: 'collection_id',
                as: 'collectionsExhibition'
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
        }
    }, {
        sequelize,
        modelName: 'Collection'
    });
    return Collection;
};