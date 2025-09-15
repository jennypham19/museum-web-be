// src/validations/post.validation.js
const Joi = require('joi');

const createPost = {
  body: Joi.object().keys({
    category: Joi.number().integer().required().messages({
        'string.empty': 'Thể loại không được để trống.',
        'any.required': 'Thể loại là trường bắt buộc.',
    }),
    date: Joi.string().isoDate().required().messages({ 
        'string.empty': 'Thời gian không được để trống.',
        'any.required': 'Thời gian là trường bắt buộc.',
        'date.isoDate': 'Định dạng thời gian không hợp lệ.',
    }),
    title: Joi.string().required().messages({
      'string.empty': 'Tiêu đề không được để trống.',
      'any.required': 'Tiêu đề là trường bắt buộc.',
    }),
    summary: Joi.string().required().messages({
      'string.empty': 'Tóm tắt không được để trống.',
      'any.required': 'Tóm tắt là trường bắt buộc.',
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
    nameUrl: Joi.string().optional(),
    content: Joi.string().required().messages({
      'string.empty': 'Nội dung không được để trống.',
      'any.required': 'Nội dung là trường bắt buộc.',
    }),
    authorName: Joi.string().required().messages({
        'string.empty': 'Tên tác giả không được để trống.',
        'any.required': 'Tên tác giả là trường bắt buộc.',
    }),
    source: Joi.object({
      name: Joi.string().optional(),
      url: Joi.string().required()
    }).optional().allow(null),
    images: Joi.array().items(
        Joi.object({
            name: Joi.string().optional(),
            url: Joi.string().required()
        })
    ).required(),
    videos: Joi.array().items(
        Joi.object({
            name: Joi.string().optional(),
            url: Joi.string().required()
        })
    ).required(),
  }),
};

module.exports = {
    createPost
}