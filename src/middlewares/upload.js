// src/middlewares/upload.js
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const path = require('path');
const ApiError = require('../utils/ApiError');
const { StatusCodes } = require('http-status-codes');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { v4: uuidv4 } = require("uuid");
const crypto = require('crypto');

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

    // Lấy tên gốc không đuôi
    let baseName = path.parse(file.originalname).name;

    // sanitize tên: chỉ cho phép chữ, số, dấu gạch ngang và gạch dưới
    baseName = baseName.replace(/[^a-zA-Z0-9-_]/g, "_");
    const fileHash = crypto.createHash("md5").update(baseName).digest("hex");

    return {
      folder,
      resource_type: "auto",                        // fix lỗi resource_type
      use_filename: true, // giữ tên gốc của file
      unique_filename: false, // không thêm chuỗi random vào
      public_id: `${baseName}_${fileHash}`, // lồng originalname vào public_id
      overwrite: false, // nếu trùng báo lỗi
    }
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // Giới hạn chung 100MB (Cloudinary free cũng max ~100MB)
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      if (file.size > 5 * 1024 * 1024) {
        return cb(
          new ApiError(StatusCodes.BAD_REQUEST, "Ảnh vượt quá dung lượng 5MB!"),
          false
        );
      }
      return cb(null, true);
    } else if (file.mimetype.startsWith("video/")) {
      if (file.size > 100 * 1024 * 1024) {
        return cb(
          new ApiError(
            StatusCodes.BAD_REQUEST,
            "Video vượt quá dung lượng 100MB!"
          ),
          false
        );
      }
      return cb(null, true);
    } else {
      return cb(
        new ApiError(
          StatusCodes.BAD_REQUEST,
          "Chỉ cho phép upload file ảnh hoặc video!"
        ),
        false
      );
    }
  },
});

module.exports = upload;