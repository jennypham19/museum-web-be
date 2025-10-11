'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Event extends Model {
        static associate(models) {
            Event.hasMany(models.EventExhibition, {
                foreignKey: 'event_id',
                as: 'eventsExhibition'
            }),
            Event.belongsTo(models.User, {
                foreignKey: 'user_id_approve',
                as: 'approvedEventnByUser'
            }),
            Event.belongsTo(models.User, {
                foreignKey: 'user_id_send',
                as: 'sentEventByUser'
            }),
            Event.belongsTo(models.User, {
                foreignKey: 'curator_id',
                as: 'EventCurator'
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
        // Cột name_image: tên ảnh của sự kiện,
        name_image: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // Cột topic: chủ đề của sự kiện
        topic: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // rejection_reason: lý do từ chối, kiểu text, có thể null
        rejection_reason: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        // is_published: đăng tải, kiểu boolean, giá trị mặc định là false
        is_published: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        // reason_send: lý do gửi lên trên, kiểu chuỗi, có thể null
        reason_send: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // note: ghi chú nếu là lý do khác, kiểu text, có thể null
        note: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        // Cột user_id_approve: id người duyệt (kiểm duyệt viên hoặc quản trị viên), kiểu số, có thể null
        user_id_approve: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        // Cột user_id_send: id người gửi (kiểm duyệt viên), kiểu số, có thể null
        user_id_send: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        // Cột curator_id: id người phụ trách (người thêm mới tác phẩm), kiểu số, có thể null
        curator_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Event'
    });

    return Event;
};