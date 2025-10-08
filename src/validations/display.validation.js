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

// Thêm mới bộ sưu tập
const createCollection = {
  body: Joi.object().keys({
    name: Joi.string().required().messages({
      'string.empty': 'Tên không được để trống.',
      'any.required': 'Tên là trường bắt buộc.',
    }),
    tags: Joi.string().required().messages({
      'string.empty': 'Chủ đề không được để trống.',
      'any.required': 'Chủ đề là trường bắt buộc.',
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
    curatorId: Joi.number().integer().required()
  }),
};

// Chỉnh sửa bộ sưu tập
const updateCollection = {
  params: Joi.object().keys({
    id: Joi.number().integer().required()
  }),
  body: Joi.object().keys({
    name: Joi.string().required().messages({
      'string.empty': 'Tên không được để trống.',
      'any.required': 'Tên là trường bắt buộc.',
    }),
    tags: Joi.string().required().messages({
      'string.empty': 'Chủ đề không được để trống.',
      'any.required': 'Chủ đề là trường bắt buộc.',
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
    curatorId: Joi.number().integer().required()
  }),
};

// Lấy ra danh sách + search
const getQuery = {
    query: Joi.object().keys({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
        searchTerm: Joi.string().optional(),
        curatorId: Joi.number().integer().optional()
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
const rejectApproval = {
  params: Joi.object().keys({
    id: Joi.number().integer().required()
  }),
  body: Joi.object().keys({
    status: Joi.string().required(),
    userIdApprove: Joi.number().integer().optional(),
    rejectionReason: Joi.string().required()
  })
}


// Gỡ/ gán tác phẩm khỏi/ vào bộ sưu tập
const detachOrAttachArtToCollection = {
  params: Joi.object().keys({
    collectionId: Joi.number().integer().required()
  }),
  body: Joi.object().keys({
    artIds: Joi.array().items(Joi.number().integer()).required()
  })
}
module.exports = {
    createPainting,
    getQuery,
    getId,
    sendApproval,
    publishPainting,
    rejectApproval,
    createCollection,
    detachOrAttachArtToCollection,
    updateCollection
}