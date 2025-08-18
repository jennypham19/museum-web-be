const { User, Token } = require('../models');
const bcrypt = require('bcryptjs');
const { StatusCodes } = require('http-status-codes');
const ApiError = require('../utils/ApiError');

const loginWithEmailAndPassword = async (email, password) => {
    try {
        const user = await User.findOne({ where: { email }});
        if(!user || !(await bcrypt.compare(password, user.password))) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, 'Tên đăng nhập hoặc mật khẩu không chính xác');
        }
        if(user.is_active === 0) {
            throw new ApiError(StatusCodes.FORBIDDEN, 'Tài khoản đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên');
        }
        return user;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Server error during login process.' + error.message);
    }

}

const register = async (userBody) => {
    const { email, password } = userBody;
    const clientFullName = userBody.full_name;
    const defaultRole = 'employee';
    if (!clientFullName) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Họ và tên (fullName) là bắt buộc.');
    }
    if (!email) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Email là bắt buộc.');
    }
    if (!password) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Mật khẩu là bắt buộc.');
    }

    if(await User.findOne({ where: { email }})) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Email đã được sử dụng');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        full_name: clientFullName,
        email,
        password: hashedPassword,
        role: defaultRole,
        is_change_type: 0
    })
    const userJson = user.toJSON();
    delete userJson.password;
    return userJson;
}

const logout = async (refreshToken) => {
    const refreshTokenDoc = await Token.findOne({ where: { token: refreshToken, type: 'refresh'}});
    if(!refreshTokenDoc) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Refresh token không tồn tại');
    }

    await refreshTokenDoc.destroy();
}

module.exports = {
    loginWithEmailAndPassword,
    register,
    logout
}