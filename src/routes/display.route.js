const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const displayValidation = require('../validations/display.validation');
const displayController = require('../controllers/display.controller');

const router = express.Router();

router.use(protect, authorize('employee'));

// Thêm mới tác phẩm
router
    .route('/create-painting')
    .post(validate(displayValidation.createPainting), displayController.createPainting)

module.exports = router;