//src/routes/upload.route.js
const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const uploadController = require('../controllers/upload.controller');
const checkFileSize = require("../middlewares/checkFileSize");

const router = express.Router();

router.use(protect, authorize('employee', 'admin', 'mod'));

//upload ảnh
router.post(
    '/upload-image',
    upload.single('image'),
    checkFileSize.checkFileSize,
    uploadController.uploadImageSingle
)

// upload nhiều ảnh
router.post(
    '/upload-images', 
    upload.array('images', 10), 
    checkFileSize.checkFilesSize,
    uploadController.uploadEmployeeImageMultiple
);

// upload nhiều video
router.post(
    '/upload-videos', 
    upload.array('videos', 5), 
    checkFileSize.checkFilesSize,
    uploadController.uploadEmployeeImageMultiple
);

module.exports = router;