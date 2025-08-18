const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const packageValidation = require('../validations/package.validation');
const packageController = require('../controllers/package.controller'); 

const router = express.Router();

router.get('/list', validate(packageValidation.getPackages), packageController.getPackages);

router.use(protect);
router
    .route('/')
    .post(authorize('employee', 'admin'), validate(packageValidation.createPackage), packageController.createPackage)

module.exports = router;