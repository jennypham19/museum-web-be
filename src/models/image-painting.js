'use strict'
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ImagePainting extends Model {
        static associate(models) {
            ImagePainting.belongsTo(models.Image, {
                foreignKey: 'image_id',
                as: 'images'
            }),
            ImagePainting.belongsTo(models.Painting, {
                foreignKey: 'painting_id',
                as: 'painting'
            })
        }
    };

    ImagePainting.init({
        // Cột image_id: khóa ngoại, liên kết đến Images, không null
        image_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        // Cột painting_id: khóa ngoại, liên kết đến Paintings, không null
        painting_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'ImagePainting',
        tableName: 'ImagesPainting'
    });

    return ImagePainting;
}