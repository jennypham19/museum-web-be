'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class PaintingExhibition extends Model {
        static associate(models){
            PaintingExhibition.belongsTo(models.Painting, {
                foreignKey: 'painting_id',
                as: 'painting'
            }),
            PaintingExhibition.belongsTo(models.Exhibition, {
                foreignKey: 'exhibition_id',
                as: 'exhibition'
            })
        }
    };

    PaintingExhibition.init({
        // Cột painting_id: khóa ngoại, liên kết đến Paintings, không null
        painting_id: {
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
        modelName: 'PaintingExhibition',
        tableName: 'PaintingsExhibition'
    });

    return PaintingExhibition;
}