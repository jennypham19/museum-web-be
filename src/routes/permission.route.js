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

module.exports = router;