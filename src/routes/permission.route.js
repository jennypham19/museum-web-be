const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const permissionValidation = require('../validations/permission.validation');
const permissionController = require('../controllers/permission.controller');

const router = express.Router();


router.use(protect);
// Lây danh sách
router
    .route('/actions')
    .get(authorize('admin'), validate(permissionValidation.getQuery), permissionController.getActions)

// Tạo mới 
router
    .route('/create-action')
    .post(authorize('admin'), validate(permissionValidation.createAction), permissionController.createAction)

// Cập nhật
router
    .route('/update-action/:id')
    .put(authorize('admin'), validate(permissionValidation.updateAction), permissionController.updateAction)

// Tạo mới chức năng
router
    .route('/create-menu')
    .post(authorize('admin'), validate(permissionValidation.createMenu), permissionController.createMenu)

// Lây danh sách chức năng
router
    .route('/menus')
    .get(authorize('admin'), validate(permissionValidation.getQuery), permissionController.getMenus)

// Lây chi tiết chức năng
router
    .route('/menu/:id')
    .get(authorize('admin'), validate(permissionValidation.getId), permissionController.getMenu)

// Cập nhật chức năng
router
    .route('/update-menu/:id')
    .put(authorize('admin'), validate(permissionValidation.updateMenu), permissionController.updateMenu)

// Lấy danh sách chức năng kèm thao tác
router
    .route('/menu-with-action')
    .get(authorize('admin'), permissionController.getMenuWithAction)

// Lấy danh sách nhóm quyền
router
    .route('/role-groups')
    .get(authorize('admin'), validate(permissionValidation.getQuery), permissionController.getPermissions)

// Tạo nhóm quyền
router.post('/create-permission-group', authorize('admin'), validate(permissionValidation.createRoleGroup), permissionController.createRoleGroup);

module.exports = router;