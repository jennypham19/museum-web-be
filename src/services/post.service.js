const { Post, Source, Image, Video, sequelize, User } = require('../models');
const { StatusCodes } = require('http-status-codes');
const ApiError = require('../utils/ApiError');
// Thêm mới bài viết bộ sưu tập
const createPostCollection = async(postBody) => {
    try {

    } catch (error) {
        if (!transaction.finished) {   // ✅ chỉ rollback nếu chưa commit/rollback
            await transaction.rollback();
        }
        if( error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Lỗi khi tạo bài viết: ' + error.message);
    }
}

module.exports = {
    createPostCollection,
}