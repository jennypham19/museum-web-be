const Joi = require('joi');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().messages({
      'string.empty': 'Email không được để trống.',
      'any.required': 'Email là trường bắt buộc.',
    }),
    full_name: Joi.string().required().messages({
      'string.empty': 'Họ tên không được để trống.',
      'any.required': 'Họ tên là trường bắt buộc.',
    }),
    avatar_url: Joi.string().optional(),
    password: Joi.string().required().messages({
        'string.empty': 'Mật khẩu không được để trống.',
        'any.required': 'Mật khẩu là trường bắt buộc.',
    }),
    phone_number: Joi.string().required().messages({
        'string.empty': 'Số điện thoại không được để trống.',
        'any.required': 'Số điện thoại là trường bắt buộc.',
    }),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(6), 
    role: Joi.alternatives().try(
      Joi.array().items(Joi.string()), // role[]=employee&role[]=admin
      Joi.string() // role=employee,admin
    ),
    status: Joi.number().integer().optional(),
    searchTerm: Joi.string().optional(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
};

const unactiveOrActiveUser = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
  body: Joi.object().keys({
    is_active: Joi.number().integer().required(),
  })
};

const deleteUser = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
};

module.exports = {
    createUser,
    getUsers,
    getUser,
    unactiveOrActiveUser,
    deleteUser
}

