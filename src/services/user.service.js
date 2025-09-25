const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcryptjs');
const crypto = require('crypto')
const { User, UserRole, RoleGroup } = require('../models');
const ApiError = require('../utils/ApiError');
const { Op } = require('sequelize');

// Kiểm tra xem có tồn tại email không
const isEmailTaken = async (email) => {
    const user = await User.findOne({ where: { email}});
    return !!user;
}

//Tạo tài khoản
const createUser = async (userBody) => {
    if(await isEmailTaken(userBody.email)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Email đã tồn tại')
    }
    // Hash bằng bcrypt
    const hashedPassword = await bcrypt.hash(userBody.password, 10);
    const user = await User.create({ ...userBody, password: hashedPassword, is_active: 1, is_change_type: 0});
    user.password = undefined; // Không trả về password
    return user;
}

// Lấy danh sách
const queryUsers = async (queryOptions) => {
    try {
        const { page, limit, role, status, searchTerm } = queryOptions;
        const offset = (page - 1) * limit;
        const whereClause = {};

        if(role) {
            if (Array.isArray(role)) {
                whereClause.role = { [Op.in]: role }
            } else {
                whereClause.role = { [Op.in]: [role] }
            }
        }

        if(searchTerm){
            whereClause[Op.or] = [
                { email: { [Op.iLike]: `%${searchTerm}%`}},
                { full_name: { [Op.iLike]: `%${searchTerm}%`}},
                { phone_number: { [Op.iLike]: `%${searchTerm}%`}},
            ]
        }

        if (status !== undefined && status !== 'all' && status !== null) {
            whereClause.is_active = status;
        }

        const { count, rows: users } = await User.findAndCountAll({
            where: whereClause,
            include:[
                {
                    model: UserRole,
                    as: 'users',
                    include: [
                        { model: RoleGroup, as: 'roleGroup'}
                    ]
                }
            ],
            attributes: { exclude: ['password']},
            order: [
                ['updatedAt', 'ASC'],
            ],
            limit,
            offset,
            distinct: true // chỉ tính count trong Users
        });
        const totalPages = Math.ceil(count/limit);
        const formattedUsers =  users.map((user) => {
            const newUser = user.toJSON();
            return {
                id: newUser.id,
                email: newUser.email,
                avatarUrl: newUser.avatar_url,
                createdAt: newUser.createdAt,
                fullName: newUser.full_name,
                isActive: newUser.is_active,
                isChangeType: newUser.is_change_type,
                phoneNumber: newUser.phone_number,
                role: newUser.role,
                updatedAt: newUser.updatedAt,
                permission: newUser.users ? newUser.users.roleGroup.name : null
            }
        })
        return {
            users: formattedUsers,
            totalPages,
            currentPage: page,
            totalUsers: count
        }
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Get all list users is failed " + error.message);
    }
}

// Lấy chi tiết 1 bản ghi
const getUserById = async (id) => {
    const user = await User.findByPk(id, { attributes: { exclude: ['password']}});
    if(!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy người dùng')
    }
    return user;
}

// Vô hiệu hóa
const unactiveUserById = async (id, updateBody) => {
    const user = await getUserById(id);
    // Nếu tồn tại bài viết do user tạo ra

    // Nếu không tồn tại bài viết thì vô hiệu hóa
    Object.assign(user, updateBody);
    await user.save();
    return user;
}

// Kích hoạt
const activeUserById = async (id, updateBody) => {
    const user = await getUserById(id);
    Object.assign(user, updateBody);
    await user.save();
    return user;
}

// Xóa tài khoản
const deleteUser = async (id) => {
  //Nếu tồn tại bài viết do user tạo ra

  // Nếu không có bài viết thì xóa user
  await User.destroy({ where: { id: id }})
}

module.exports = {
    createUser,
    queryUsers,
    getUserById,
    unactiveUserById,
    activeUserById,
    deleteUser
}