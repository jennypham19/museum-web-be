const Joi = require('joi');

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const register = {
  body: Joi.object().keys({
    full_name: Joi.string().required().messages({
      'string.empty': 'Id người dùng là bắt buộc',
      'any.required': 'Id người dùng là bắt buộc',
    }),
    email: Joi.string().required().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).messages({
      'string.pattern.base': 'Email không hợp lệ.',
      'string.empty': 'Email là bắt buộc',
      'any.required': 'Email là bắt buộc',
    }),
    password: Joi.string().required().min(6).messages({
      'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
      'string.empty': 'Mật khẩu là bắt buộc',
      'any.required': 'Mật khẩu là bắt buộc',
    })
  })
}

module.exports = {
    login,
    register
}