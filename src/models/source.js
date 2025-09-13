'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Source extends Model{
        static associate(models) {
            Source.belongsTo(models.Post, {
                foreignKey: 'post_id',
                as: 'sourcePost'
            })
        }
    };

    Source.init({
        // Cột post_id: khóa ngoại, liên kết bảng Posts, không được null
        post_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        // Cột link_facebook: đường dẫn fb, kiểu chuỗi, có thể null
        link_facebook: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // Cột link_instagram: đường dẫn insta, kiểu chuỗi, có thể null
        link_instagram: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // Cột link_youtube: đường đẫn youtube, kiểu chuỗi, có thể null
        link_youtube: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // Cột link_web: đường dẫn website, kiểu chuỗi, có thể null
        link_web: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Source'
    });

    return Source;
};