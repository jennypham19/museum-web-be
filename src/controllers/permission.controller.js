// src/controllers/permission.controller.js
const { StatusCodes } = require('http-status-codes');
const catchAsync = require('../utils/catchAsync');
const permissionService = require('../services/permission.service');
const pick = require('../utils/pick');

//Thêm mới 1 bản ghi
const createAction = catchAsync(async (req, res) => {
  const action = await permissionService.createAction(req.body);
  res.status(StatusCodes.CREATED).send({ success: true, message: 'Thêm mới thao tác thành công.', data: action });
});

//Lấy danh sách
const getActions = catchAsync(async (req, res) => {
    const queryOptions = pick(req.query, ['page', 'limit', 'searchTerm']);
    const actions = await permissionService.getActions(queryOptions);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy danh sách thành công', data: actions})
})

// Cập nhật 1 bản ghi
const updateAction = catchAsync(async (req, res) => {
    const action = await permissionService.updateAction(req.params.id, req.body);
    res.status(StatusCodes.OK).send({ success: true, message: 'Cập nhập thành công', data: action})
})

// Thêm mới chức năng
const createMenu = catchAsync(async (req, res) => {
    const menu = await permissionService.createMenu(req.body);
    res.status(StatusCodes.CREATED).send({ success: true, message: 'Thêm mới chức năng thành công', data: menu})
})

//Lấy danh sách chức năng
const getMenus = catchAsync(async (req, res) => {
    const queryOptions = pick(req.query, ['page', 'limit', 'searchTerm']);
    const menus = await permissionService.getMenus(queryOptions);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy danh sách thành công', data: menus})
})

//Lấy danh sách chức năng
const getMenu = catchAsync(async (req, res) => {
    const menu = await permissionService.getMenuById(req.params.id);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy bản ghi thành công', data: menu})
})

module.exports = {
    createAction,
    getActions,
    updateAction,
    createMenu,
    getMenus,
    getMenu
}