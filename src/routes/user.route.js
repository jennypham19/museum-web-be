//src/routes/post.route.js
const express = require('express');

const { protect, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const uploadController = require('../controllers/upload.controller');

const router = express.Router();

router.use(protect);

router.post(
    '/upload-image',
    authorize('employee', 'admin'),
    upload.single('image'),
    // upload.fields([{ name: "image", maxCount: 1 }, { name: "type", maxCount: 1 }]),
    uploadController.uploadEmployeeImageSingle
)

module.exports = router;