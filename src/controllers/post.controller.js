// src/controllers/post.controller.js
const { StatusCodes } = require('http-status-codes');
const catchAsync = require('../utils/catchAsync');
const postService = require('../services/post.service');
const pick = require('../utils/pick');

// Thêm mới bài viết bộ sưu tập
const createPostCollection = catchAsync(async (req, res) => {
    const post = await postService.createPostCollection(req.body);
    res.status(StatusCodes.CREATED).send({ success: true, message: 'Tạo bài viết thành công. Đang chờ phê duyệt', data: post})
})

module.exports = {
    createPostCollection,
}