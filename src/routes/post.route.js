//src/routes/post.route.js
const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');

const router = express.Router();

router.use(protect);

module.exports = router;