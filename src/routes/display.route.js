const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const displayValidation = require('../validations/display.validation');
const displayController = require('../controllers/display.controller');

const router = express.Router();

router.use(protect, authorize('employee', 'admin', 'mod'));

// Thêm mới tác phẩm
router
    .route('/create-painting')
    .post(validate(displayValidation.createPainting), displayController.createPainting)


// Lấy ra danh sách + search tác phẩm
router
    .route('/get-list-paintings')
    .get(validate(displayValidation.getQuery), displayController.getListPaintings)


// Gửi phê duyệt
router
    .route('/send-approval-painting/:id')
    .patch(validate(displayValidation.sendApproval), displayController.sendApproval)

// Đăng tải
router
    .route('/publish-painting/:id')
    .patch(validate(displayValidation.publishPainting), displayController.publishPainting)
module.exports = router;