const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const permissionValidation = require('../validations/permission.validation');
const permissionController = require('../controllers/permission.controller');

const router = express.Router();

router.get('/get-assigned-group-to-user/:id', validate(permissionValidation.getRoleGroupToUser), permissionController.getRoleGroupByUserId)

router.use(protect, authorize('admin'));
// Lây danh sách
router
    .route('/actions')
    .get(validate(permissionValidation.getQuery), permissionController.getActions)

// Tạo mới 
router
    .route('/create-action')
    .post(validate(permissionValidation.createAction), permissionController.createAction)

// Cập nhật
router
    .route('/update-action/:id')
    .put(validate(permissionValidation.updateAction), permissionController.updateAction)

// Tạo mới chức năng
router
    .route('/create-menu')
    .post(validate(permissionValidation.createMenu), permissionController.createMenu)

// Lây danh sách chức năng
router
    .route('/menus')
    .get(validate(permissionValidation.getQuery), permissionController.getMenus)

// Lây chi tiết chức năng
router
    .route('/menu/:id')
    .get(validate(permissionValidation.getId), permissionController.getMenu)

// Cập nhật chức năng
router
    .route('/update-menu/:id')
    .put(validate(permissionValidation.updateMenu), permissionController.updateMenu)

// Lấy danh sách chức năng kèm thao tác
router
    .route('/menu-with-action')
    .get(permissionController.getMenuWithAction)

// Lấy danh sách nhóm quyền
router
    .route('/role-groups')
    .get(validate(permissionValidation.getQuery), permissionController.getPermissions)

// Tạo nhóm quyền
router.post('/create-permission-group', validate(permissionValidation.createRoleGroup), permissionController.createRoleGroup);

// Lấy chi tiết 1 nhóm quyền kèm với chức năng và thao tác
router
    .route('/role-group-with-menu-action/:id')
    .get(validate(permissionValidation.getId), permissionController.getDetailRoleGroupWithMenuAndAction)

// chỉnh sửa nhóm quyền kèm với chức năng và thao tác
router
    .route('/update-permission-group/:id')
    .put(validate(permissionValidation.updateRoleGroup), permissionController.updateRoleGroupWithMenuAndAction)

// Lấy danh sách nhóm quyền có gắn chức năng
router
    .route('/role-groups-with-menu')
    .get(validate(permissionValidation.getQuery), permissionController.getRoleGroups)

// Gán nhóm quyền cho user
router
    .route('/assign-group-to-user')
    .post(validate(permissionValidation.assignRoleGroupToUser), permissionController.assignRoleGroupToUser)

module.exports = router;