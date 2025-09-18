'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Event extends Model {
        static associate(models) {
            Event.hasMany(models.EventExhibition, {
                foreignKey: 'event_id',
                as: 'eventsExhibition'
            })
        }
    };

    Event.init({
        // Cột name: tên sự kiện, kiểu chuỗi, không được null
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Cột description: mô tả, kiểu text, không được phép null
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        // Cột start_date: ngày bắt đầu, kiểu date, không được null
        start_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        // Cột end_date: ngày kết thúc, kiểu date, không được null
        end_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        // Cột open_time: giờ mở cửa sự kiện, kiểu chuỗi, không được null
        open_time: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Cột close_time: giờ đóng cửa sự kiện, kiểu chuỗi, không được null
        close_time: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Cột image_url: ảnh của sự kiện, kiểu chuỗi, không được null
        image_url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Cột topic: chủ đề của sự kiện
        topic: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Event'
    });

    return Event;
};