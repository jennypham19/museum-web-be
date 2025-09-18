'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Video extends Model{
        static associate(models) {
            Video.belongsTo(models.Post, {
                foreignKey: 'post_id',
                as: 'videosPost'
            }),
            Video.belongsTo(models.Event, {
                foreignKey: 'event',
                as: 'videosEvent'
            })
        }
    };

    Video.init({
        // Cột post_id: khóa ngoại, kiên kết bảng Posts, không được null
        post_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        // Cột name: tên video, kiểu chuỗi, không được null
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Cột url: đường dẫn video, kiểu chuỗi, không được null
        url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Cột event_id: khóa ngoại, kiên kết bảng Events, không được null
        event_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }, {
        sequelize,
        modelName: 'Video'
    });
    
    return Video;
};