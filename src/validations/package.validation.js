const Joi = require("joi");

//Lấy danh sách
const getPackages = {
    query: Joi.object().keys({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(2),
    })
};

//Lấy chi tiết 1 bản ghi
const getPackage = {
    params: Joi.object().keys({
        id: Joi.number().integer().required()
    })
}

// Thêm mới 1 bản ghi
const createPackage = {
    body: Joi.object().keys({
        title: Joi.string().required().messages({
            'string.empty': 'Tên gói không được để trống',
            'any.required': 'Tên gói là trường bắt buộc'
        }),
        price: Joi.string().required().messages({
            'string.empty': 'Giá không được để trống',
            'any.required': 'Giá là trường bắt buộc'
        }),
        members: Joi.number().integer().required().messages({
            'string.empty': 'Số lượng thành viên không được để trống',
            'any.required': 'Số lượng thành viên là trường bắt buộc'
        }),
        guests: Joi.number().integer().required().messages({
            'string.empty': 'Số lượng khách không được để trống',
            'any.required': 'Số lượng khách là trường bắt buộc'
        }),
        benefits: Joi.string().required().messages({
            'string.empty': 'Quyền lợi không được để trống',
            'any.required': 'Quyền lợi là trường bắt buộc'
        }),
        includes: Joi.string().optional()
    })
}

module.exports = {
    createPackage,
    getPackages,
    getPackage
}