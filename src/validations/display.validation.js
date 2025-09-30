// src/validations/post.validation.js
const Joi = require('joi');

// Thêm mới tác phẩm
const createPainting = {
  body: Joi.object().keys({
    name: Joi.string().required().messages({
      'string.empty': 'Tên không được để trống.',
      'any.required': 'Tên là trường bắt buộc.',
    }),
    author: Joi.string().required().messages({
      'string.empty': 'Tác giả không được để trống.',
      'any.required': 'Tác giả là trường bắt buộc.',
    }),
    period: Joi.string().required().messages({
      'string.empty': 'Thời kỳ không được để trống.',
      'any.required': 'Thời kỳ là trường bắt buộc.',
    }),
    imageUrl: Joi.string().required().messages({
        'string.empty': 'Đường dẫn ảnh không được để trống.',
        'any.required': 'Đường dẫn ảnh là bắt buộc.',
    }),
    description: Joi.string().required().messages({
      'string.empty': 'Mô tả không được để trống.',
      'any.required': 'Mô tả là trường bắt buộc.',
    }),
    nameImage: Joi.string().optional(),
    images: Joi.array().items(
        Joi.object({
            name: Joi.string().optional(),
            url: Joi.string().required()
        })
    ).required(),
  }),
};

// Lấy ra danh sách + search
const getQuery = {
    query: Joi.object().keys({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
        searchTerm: Joi.string().optional()
    })
}

// Lấy chi tiết 1 bản ghi
const getId = {
    params: Joi.object().keys({
        id: Joi.number().integer().required()
    })
}

// Gửi phê duyệt/ duyệt
const sendApproval = {
  params: Joi.object().keys({
    id: Joi.number().integer().required()
  }),
  body: Joi.object().keys({
    status: Joi.string().required(),
    userIdApprove: Joi.number().integer().optional()
  })
}

// Đăng tải
const publishPainting = {
  params: Joi.object().keys({
    id: Joi.number().integer().required()
  }),
  body: Joi.object().keys({
    is_published: Joi.boolean().required()
  })
}

// Từ chối
const rejectPainting = {
  params: Joi.object().keys({
    id: Joi.number().integer().required()
  }),
  body: Joi.object().keys({
    status: Joi.string().required(),
    userIdApprove: Joi.number().integer().optional(),
    rejectionReason: Joi.string().required()
  })
}

module.exports = {
    createPainting,
    getQuery,
    getId,
    sendApproval,
    publishPainting,
    rejectPainting
}