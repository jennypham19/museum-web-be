const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const displayValidation = require('../validations/display.validation');
const displayController = require('../controllers/display.controller');

const router = express.Router();

router.use(protect, authorize('employee', 'admin', 'mod'));

{/* --------------------------- 1. TÁC PHẨM --------------------------- */}
// Thêm mới tác phẩm
router
    .route('/create-painting')
    .post(validate(displayValidation.createPainting), displayController.createPainting)

// Lấy ra danh sách + search tác phẩm
router
    .route('/get-list-paintings')
    .get(validate(displayValidation.getQuery), displayController.getListPaintings)

// Gửi phê duyệt tác phẩm
router
    .route('/send-approval-painting/:id')
    .patch(validate(displayValidation.sendApproval), displayController.sendApproval)

// Đăng tải tác phẩm
router
    .route('/publish-painting/:id')
    .patch(validate(displayValidation.publishPainting), displayController.publishPainting)

// Duyệt tác phẩm
router
    .route('/approve-painting/:id')
    .put(validate(displayValidation.sendApproval), displayController.approvePainting)

// Từ chối tác phẩm
router 
    .route('/reject-painting/:id')
    .put(validate(displayValidation.rejectApproval), displayController.rejectPainting)

// Xóa tác phẩm
router
    .route('/delete-painting/:id')
    .delete(validate(displayValidation.getId), displayController.deletePainting)

{/*--------------------------- 2. BỘ SƯU TẬP --------------------------- */}
// Thêm mới bộ sưu tập
router
    .route('/create-collection')
    .post(validate(displayValidation.createCollection), displayController.createCollection)

// Chỉnh sửa bộ sưu tập
router 
    .route('/update-collection/:id')
    .put(validate(displayValidation.updateCollection), displayController.updateCollection)

// Lấy ra danh sách + search bộ sưu tập
router
    .route('/get-list-collections')
    .get(validate(displayValidation.getQuery), displayController.getListCollections)

// Gửi phê duyệt bộ sưu tập
router
    .route('/send-approval-collection/:id')
    .patch(validate(displayValidation.sendApproval), displayController.sendCollectionApproval)

// Duyệt bộ sưu tập
router
    .route('/approve-collection/:id')
    .put(validate(displayValidation.sendApproval), displayController.approveCollection)

// Từ chối bộ sưu tập
router
    .route('/reject-collection/:id')
    .put(validate(displayValidation.rejectApproval), displayController.rejectCollection)

// Gỡ tác phẩm khỏi bộ sưu tập
router
    .route('/detach-art-from-collection/:collectionId')
    .delete(validate(displayValidation.detachOrAttachArtToCollection), displayController.detachArtFromCollection)

// Gán tác phẩm vào bộ sưu tập
router
    .route('/attach-art-to-collection/:collectionId')
    .put(validate(displayValidation.detachOrAttachArtToCollection), displayController.attachArtToCollection)

// Lấy chi tiết bộ sưu tập có tác phẩm bên trong
router
    .route('/get-collection-has-art-by-id/:id')
    .get(validate(displayValidation.getId), displayController.getCollectionHasArtById)

// Gửi yêu cầu bộ sưu tập lên admin
router
    .route('/send-collection/:id')
    .put(validate(displayValidation.sendApprovalForAdmin), displayController.sendCollectionToAdmin)
module.exports = router;