// src/middlewares/checkFileSize.js
const ApiError = require("../utils/ApiError");
const { StatusCodes } = require("http-status-codes");

// Middleware kiểm tra dung lượng file trước khi upload
const checkFilesSize = (req, res, next) => {
  // Nếu không có file nào
  if (!req.files || req.files.length === 0) {
    return next();
  }

  for (const file of req.files) {
    if (file.mimetype.startsWith("image")) {
      if (file.size > 5 * 1024 * 1024) {
        return next(
          new ApiError(StatusCodes.BAD_REQUEST, "Ảnh vượt quá dung lượng 5MB!")
        );
      }
    } else if (file.mimetype.startsWith("video")) {
      if (file.size > 100 * 1024 * 1024) {
        return next(
          new ApiError(StatusCodes.BAD_REQUEST, "Video vượt quá dung lượng 100MB!")
        );
      }
    } else {
      return next(
        new ApiError(
          StatusCodes.BAD_REQUEST,
          "Chỉ cho phép upload file ảnh hoặc video!"
        )
      );
    }
  }

  next();
};

// Middleware kiểm tra dung lượng file trước khi upload
const checkFileSize = (req, res, next) => {
  // Nếu không có file nào
  if (!req.file) {
    return next();
  }

  const file = req.file;

    if (file.mimetype.startsWith("image")) {
      if (file.size > 5 * 1024 * 1024) {
        return next(
          new ApiError(StatusCodes.BAD_REQUEST, "Ảnh vượt quá dung lượng 5MB!")
        );
      }
    } else if (file.mimetype.startsWith("video")) {
      if (file.size > 500 * 1024 * 1024) {
        return next(
          new ApiError(StatusCodes.BAD_REQUEST, "Video vượt quá dung lượng 500MB!")
        );
      }
    } else {
      return next(
        new ApiError(
          StatusCodes.BAD_REQUEST,
          "Chỉ cho phép upload file ảnh hoặc video!"
        )
      );
    }

  next();
};

module.exports = {
    checkFilesSize,
    checkFileSize
};
