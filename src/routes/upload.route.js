//src/routes/upload.route.js
const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const uploadController = require('../controllers/upload.controller');

const router = express.Router();

router.use(protect, authorize('employee', 'admin'));

//upload ảnh
router.post(
    '/upload-image',
    upload.single('image'),
    uploadController.uploadImageSingle
)

module.exports = router;