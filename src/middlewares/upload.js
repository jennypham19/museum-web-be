// src/middlewares/upload.js
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const path = require('path');
const ApiError = require('../utils/ApiError');
const { StatusCodes } = require('http-status-codes');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Lưu trực tiếp vào Cloudinary với folder động
const storage = new CloudinaryStorage({
  cloudinary,
  params:(req, file) => {
    // mặc định folder gốc
    let folder = "museum";

    //Nếu gửi lên kèm theo type => tạo folder con theo type
    // ví dụ req.body.type = 'employees' => museum/employees
    if (req.body.type) {
      folder = `${folder}/${req.body.type}`;
    }else {
      console.warn("⚠️ req.body.type missing, fallback to museum/");
    }

    return {
      folder,
      resource_type: "image",                        // fix lỗi resource_type
      use_filename: true,
      unique_filename: true,
    }
  }
})

// Kiểm tra loại file
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new ApiError(StatusCodes.BAD_REQUEST, 'Chỉ cho phép upload file ảnh!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } // Giới hạn 5MB
});

module.exports = upload;