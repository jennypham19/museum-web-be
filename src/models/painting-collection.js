'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class PaintingCollection extends Model {
        static associate(models){
            PaintingCollection.belongsTo(models.Painting, {
                foreignKey: 'painting_id',
                as: 'painting'
            }),
            PaintingCollection.belongsTo(models.Collection, {
                foreignKey: 'collection_id',
                as: 'collection'
            })
        }
    };

    PaintingCollection.init({
        // Cột painting_id: khóa ngoại, liên kết đến Paintings, không null
        painting_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        // Cột collection_id: khóa ngoại, liên kết đến Collections, không null
        collection_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'PaintingCollection',
        tableName: 'PaintingsCollection'
    });

    return PaintingCollection;
}