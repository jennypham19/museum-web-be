'use strict'
const { Model, DATE } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Post extends Model {
        static associate(models) {
            Post.hasOne(models.Source, {
                foreignKey: 'post_id',
                as: 'postSource'
            });
            Post.hasMany(models.Video, {
                foreignKey: 'post_id',
                as: 'postVideos'
            });
            Post.belongsTo(models.User, {
                foreignKey: 'author_id',
                as: 'postUser'
            })
        }
    };

    Post.init({
        // Cột category: thể loại, kiểu số, không được phép null
        category: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        // Cột date: ngày tạo bài viết, kiểu date, không được null
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        // Cột title: Tiêu đề, kiểu chuỗi, không được null
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Cột summary: tóm tắt, kiểu text, không được null
        summary: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        // Cột author: tác giả, kiểu chuỗi, không được null
        author: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Cột period: thời kỳ, kiểu chuỗi, không được null
        period: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Cột name_url: tên ảnh, kiểu chuỗi, được phép null
        name_url: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // Cột image_url: đường dẫn ảnh, kiểu chuỗi và không được phép null
        image_url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Cột content: nội dung, kiểu text, không được null
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        // Cột status: trạng thái bài viết, kiểu enum, không được null
        status: {
            type: DataTypes.ENUM('pending', 'approved', 'rejected'),
            allowNull: false,
            defaultValue: 'pending'
        },
        // Cột is_published: trạng thái đăng tải, kiểu boolean, không được phép null
        is_published: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        // Cột rejection_reason: lý do từ chối, kiểu chuỗi, có thể null
        rejection_reason: {
            type: DataTypes.STRING,
        },
        // Cột author_id: khóa ngoại, liên kết bảng Users, không được null
        author_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Post'
    });
    return Post;
}