// src/middlewares/upload.js
const multer = require('multer');
const path = require('path');
const ApiError = require('../utils/ApiError');
const { StatusCodes } = require('http-status-codes');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Lưu trực tiếp vào Cloudinary với folder động
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    console.log("req: ", req);
    
    // mặc định folder gốc
    let folder = "museum";

    //Nếu gửi lên kèm theo type => tạo folder con theo type
    // ví dụ req.boody.type = 'employees' => museum/employees
    if(req.body.type){
      folder = `${folder}/${req.body.type}`;
    }

    return {
      folder,
      use_filename: true,
      unique_filename: true,
      overwrite: false,
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