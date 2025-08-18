// src/controllers/post.controller.js
const { StatusCodes } = require('http-status-codes');
const catchAsync = require('../utils/catchAsync');
const packageService = require('../services/package.service');
const pick = require('../utils/pick');

//Thêm mới 1 bản ghi
const createPackage = catchAsync(async (req, res) => {
  const post = await packageService.createPackage(req.body, req.user.id);
  res.status(StatusCodes.CREATED).send({ success: true, message: 'Tạo gói thành viên thành công.', data: post });
});

// Lấy danh sách
const getPackages = catchAsync(async (req, res) => {
    const queryOptions = pick(req.query, ['page', 'limit', 'searchTerm']);
    const packages = await packageService.queryPackages(queryOptions);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy danh sách thành công', data: packages});
})

module.exports = {
    createPackage,
    getPackages
}