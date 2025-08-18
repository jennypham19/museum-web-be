// src/models/token.js

'use strict';
const { Model } = require('sequelize');
const { tokenTypes } = require('../config/token');

module.exports = (sequelize, DataTypes) => {
    class Token extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Định nghĩa mối quan hệ: một Token thuộc về một user
            Token.belongsTo(models.User, {
                foreignKey: 'user_id',
                onDelete: 'CASCADE', // Nếu user bị xóa, các token của họ cũng sẽ bị xóa
            })
        }
    }

    Token.init({
        // Cột token: chuỗi token, không được null và phải là duy nhất
        token: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        // Cột type: loại token, không được null và phải là một trong các giá trị đã định nghĩa
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [[ tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL]],
            }
        },
        // Cột expires: thời gian hết hạn của token, không được null
        expires: {
            type: DataTypes.DATE,
            allowNull: false
        },
        // Cột blacklisted: đánh dấu token đã bị vô hiệu hóa hay chưa (hữu ích cho việc logout)
        blacklisted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        // Cột user_id: khóa ngoại, liên kết đến bảng Users, không được null
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Token',
        // Tên bảng trong database, mặc định Sequelize sẽ tự chuyển thành số nhiều
        // tableName: 'Tokens'
    });

    return Token;
}