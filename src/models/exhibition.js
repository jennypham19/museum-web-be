'use strict'
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Exhibition extends Model {
        static associate(models) {
            Exhibition.hasMany(models.Painting, {
                foreignKey: 'exhibition_id',
                as: 'exhibitionPaintings'
            });
            Exhibition.hasMany(models.Collection, {
                foreignKey: 'exhibition_id',
                as: 'exhibitionCollections'
            })
        }
    };

    Exhibition.init({
        // Cột name: tên triển lãm, kiểu chuỗi, không được null
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Cột description: mô tả triển lãm, kiểu text, không được null
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        // Cột status: trạng thái triển lãm, kiểu enum, không được null
        // Các trạng thái của triển lãm
        /*
            1. planned: đã lên kế hoạch (chưa công bố hoặc còn trong giai đoạn chuẩn bị).
            2. upcoming: sắp diễn ra (đã công bố, chưa mở cửa).
            3. ongoing: đang diễn ra.
            4. closing_soon: sắp kết thúc.
            5. closed: đã kết thúc.
            6. cancelled: đã hủy.
            7. postponed: hoãn lại (nếu thay đổi lịch)
            8. reopening: mở lại (trường hợp tạm đóng rồi mở tiếp)
        */
        status: {
            type: DataTypes.ENUM('planned', 'upcoming', 'ongoing', 'closing_soon', 'closed', 'cancelled', 'postponed', 'reopening'),
            allowNull: false,
            defaultValue: 'planned'
        },
        // Cột start_date: ngày giờ bắt đầu mở, kiểu date, không được null
        start_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        // Cột end_date: ngày giờ kết thúc, kiểu date, không được null
        end_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        // Cột open_time: giờ mở cửa, kiểu chuỗi, không được null
        open_time: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Cột close_time: giờ đóng cửa, kiểu chuỗi, không được null
        close_time: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Cột image_url: ảnh của triển lãm, kiểu chuỗi, không được null
        image_url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Cột reason_close: lý do đóng cửa (nếu xảy ra trước ngày kết thúc), kiểu text, có thể null
        reason_close: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        // Cột reopening_date: ngày mở lại do tạm đóng vì lý do nào đó
        reopening_date: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Exhibition'
    });
    return Exhibition;
};