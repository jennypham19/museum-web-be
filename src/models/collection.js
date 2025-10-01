'use strict'
const { Model} = require('sequelize');
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
            }),
            Collection.belongsTo(models.User, {
                foreignKey: 'user_id_approve',
                as: 'approvedCollectionByUser'
            }),
            Collection.belongsTo(models.User, {
                foreignKey: 'user_id_send',
                as: 'sentCollectionByUser'
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
        },
        // name_image: tên của anh chính, kiểu chuỗi, không null
        name_image: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // image_url: đường dẫn ảnh, kiểu chuỗi, không null
        image_url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        //status: trạng thái của bộ sưu tập, kiểu enum, không null, giá trị mặc định là created
        status: {
            type: DataTypes.ENUM('created','pending', 'reviewing', 'approved', 'rejected'),
            allowNull: false,
            defaultValue: 'created'
        },
        // tags: chủ đề của tác phẩm, kiểu chuỗi, không null
        tags: {
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

    }, {
        sequelize,
        modelName: 'Collection'
    });
    return Collection;
};