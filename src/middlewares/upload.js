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
      resource_type: "auto",                        // fix lỗi resource_type
      use_filename: true,
      unique_filename: true,
    }
  }
})

const upload = multer({
  storage: storage,
});

module.exports = upload;