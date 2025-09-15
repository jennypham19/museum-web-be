//src/routes/post.route.js
const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const postValidation = require('../validations/post.validation');
const postController = require('../controllers/post.controller');

const router = express.Router();

router.use(protect);

// Thêm mới bài viết bộ sưu tập
router
    .route('/create-post-collection')
    .post(authorize('employee'), validate(postValidation.createPost), postController.createPostCollection)

module.exports = router;