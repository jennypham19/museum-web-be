'use strict'
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class CollectionExhibition extends Model {
        static associate(models) {
            CollectionExhibition.belongsTo(models.Collection, {
                foreignKey: 'collection_id',
                as: 'collections'
            }),
            CollectionExhibition.belongsTo(models.Exhibition, {
                foreignKey: 'exhibition_id',
                as: 'exhibition'
            })
        }
    };

    CollectionExhibition.init({
        // Cột collection_id: khóa ngoại, liên kết đến Collections, không null
        collection_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        // Cột exhibition_id: khóa ngoại, liên kết đến Exhibitions, không null
        exhibition_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'CollectionExhibition',
        tableName: 'CollectionsExhibition'
    });

    return CollectionExhibition;
}