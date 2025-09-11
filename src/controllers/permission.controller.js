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

//Lấy chi tiết 1 bản ghi chức năng
const getMenu = catchAsync(async (req, res) => {
    const menu = await permissionService.getMenuById(req.params.id);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy bản ghi thành công', data: menu})
})

// Chỉnh sửa chức năng
const updateMenu = catchAsync(async (req, res) => {
    const menu = await permissionService.updateMenu(req.params.id, req.body);
    res.status(StatusCodes.CREATED).send({ success: true, message: 'Chỉnh sửa chức năng thành công', data: menu})
})

// Lấy danh sách chức năng kèm thao tác
const getMenuWithAction = catchAsync(async (req, res) => {
    const modules = await permissionService.getMenuWithAction();
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy danh sách thành công', data: modules})
})

// Tạo nhóm quyền
const createRoleGroup = catchAsync(async (req, res) => {
  const roleGroup = await permissionService.createRoleGroup(req.body);
  res.status(StatusCodes.CREATED).send({ success: true, message: 'Lưu nhóm quyền thành công', data: roleGroup});
})

// Lấy danh sách nhóm quyền
const getPermissions = catchAsync(async (req, res) => {
    const queryOptions = pick(req.query, ['page', 'limit', 'searchTerm']);
    const permissions = await permissionService.getPermissions(queryOptions);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy danh sách thành công', data: permissions})
})

// Lấy chi tiết 1 nhóm quyền kèm chức năng và thao tác
const getDetailRoleGroupWithMenuAndAction = catchAsync(async (req, res) => {
    const permission = await permissionService.getRoleGroupWithMenuAndAction(req.params.id);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy chi tiết bản ghi thành công', data: permission});
})

// Chỉnh sửa nhóm quyền
const updateRoleGroupWithMenuAndAction = catchAsync(async (req, res) => {
    const permission = await permissionService.updateRoleGroupWithMenuAndAction(req.params.id, req.body);
    res.status(StatusCodes.CREATED).send({ success: true, message: 'Chỉnh sửa chức năng thành công', data: permission})
})

// Lấy danh sách nhóm quyền có gắn chức năng
const getRoleGroups = catchAsync(async (req, res) => {
    const queryOptions = pick(req.query, ['page', 'limit', 'searchTerm']);
    const roleGroups = await permissionService.queryRoleGroups(queryOptions);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy danh sách thành công', data: roleGroups})
})

// Gán nhóm quyền cho user
const assignRoleGroupToUser = catchAsync(async (req, res) => {
    const { userId, roleGroupId } = req.body;
    await permissionService.assignRoleGroupToUser(userId, roleGroupId);
    res.status(StatusCodes.OK).send({ success: true, message: 'Gán nhóm quyền thành công.'})
})

// Lấy nhóm quyền theo id user
const getRoleGroupByUserId = catchAsync(async (req, res) => {
    const userId = req.params.id;
    const data = await permissionService.getRoleGroupByUserId(userId);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy danh sách nhóm quyền được gán thành công', data: data})
})

module.exports = {
    createAction,
    getActions,
    updateAction,
    createMenu,
    getMenus,
    getMenu,
    updateMenu,
    getMenuWithAction,
    createRoleGroup,
    getPermissions,
    getDetailRoleGroupWithMenuAndAction,
    updateRoleGroupWithMenuAndAction,
    getRoleGroups,
    assignRoleGroupToUser,
    getRoleGroupByUserId
}