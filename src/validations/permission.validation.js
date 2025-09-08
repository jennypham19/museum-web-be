const Joi = require("joi");

// Lấy danh sách
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
// Thêm mới 1 bản ghi
const createAction = {
    body: Joi.object().keys({
        code: Joi.string().required().messages({
            'string.empty': 'Mã không được để trống',
            'any.required': 'Mã là trường bắt buộc'
        }),
        name: Joi.string().required().messages({
            'string.empty': 'Tên không được để trống',
            'any.required': 'Tên là trường bắt buộc'
        })
    })
}

// Cập nhập 1 bản ghi
const updateAction = {
    params: Joi.object().keys({
        id: Joi.number().integer().required()
    }),
    body: Joi.object().keys({
        name: Joi.string().required()
    })
}

// Thêm mới 1 bản ghi
const createMenu = {
    body: Joi.object().keys({
        code: Joi.string().required().messages({
            'string.empty': 'Mã không được để trống',
            'any.required': 'Mã là trường bắt buộc'
        }),
        name: Joi.string().required().messages({
            'string.empty': 'Tên không được để trống',
            'any.required': 'Tên là trường bắt buộc'
        }),
        path: Joi.string().required().messages({
            'string.empty': 'Đường dẫn không được để trống',
            'any.required': 'Đường dẫn là trường bắt buộc'
        }),        
        icon: Joi.string().required().messages({
            'string.empty': 'Biểu tượng không được để trống',
            'any.required': 'Biểu tượng là trường bắt buộc'
        }),
        parentCode: Joi.string().allow(null, ''),
        actions: Joi.array().optional(),
    })
}

module.exports = {
    createAction,
    getQuery,
    getId,
    updateAction,
    createMenu
}