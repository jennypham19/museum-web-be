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

// Thêm mới bộ sưu tập
router
    .route('/create-collection')
    .post(validate(displayValidation.createCollection), displayController.createCollection)

// Lấy ra danh sách + search tác phẩm
router
    .route('/get-list-paintings')
    .get(validate(displayValidation.getQuery), displayController.getListPaintings)

// Lấy ra danh sách + search bộ sưu tập
router
    .route('/get-list-collections')
    .get(validate(displayValidation.getQuery), displayController.getListCollections)

// Gửi phê duyệt
router
    .route('/send-approval-painting/:id')
    .patch(validate(displayValidation.sendApproval), displayController.sendApproval)

// Đăng tải
router
    .route('/publish-painting/:id')
    .patch(validate(displayValidation.publishPainting), displayController.publishPainting)

// Duyệt
router
    .route('/approve-painting/:id')
    .put(validate(displayValidation.sendApproval), displayController.approvePainting)

// Từ chối
router 
    .route('/reject-painting/:id')
    .put(validate(displayValidation.rejectPainting), displayController.rejectPainting)

// Xóa tác phẩm
router
    .route('/delete-painting/:id')
    .delete(validate(displayValidation.getId), displayController.deletePainting)
module.exports = router;