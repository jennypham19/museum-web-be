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
    images: Joi.array().items(
        Joi.object({
            name: Joi.string().optional(),
            url: Joi.string().required()
        })
    ).required(),
  }),
};

module.exports = {
    createPainting
}