//src/routes/post.route.js
const express = require('express');

const { protect, authorize } = require('../middlewares/auth');
const userController = require('../controllers/user.controller');
const userValidation = require('../validations/user.validation');
const validate = require('../middlewares/validate');

const router = express.Router();

router.use(protect);

// tạo 
router.post(
    '/create-user',
    authorize('admin'),
    validate(userValidation.createUser),
    userController.createUser
)

// lấy danh sách
router.get(
    '/get-all',
    authorize('admin'),
    validate(userValidation.getUsers),
    userController.getAllUser
)

// lấy chi tiết
router.get(
    '/get-detail-user/:id',
    authorize('admin'),
    validate(userValidation.getUser),
    userController.getUser
)

// vô hiệu hóa
router.patch(
    '/unactive/:id',
    authorize('admin'),
    validate(userValidation.unactiveOrActiveUser),
    userController.unactiveUser
)
// kích hoạt
router.patch(
    '/active/:id',
    authorize('admin'),
    validate(userValidation.unactiveOrActiveUser),
    userController.activeUser
)
// xóa
router.delete(
    '/delete/:id',
    authorize('admin'),
    validate(userValidation.deleteUser),
    userController.deleteUser
)
module.exports = router;