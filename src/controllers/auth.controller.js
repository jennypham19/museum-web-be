const { StatusCodes } = require('http-status-codes');
const catchAsync = require('../utils/catchAsync');
const authService = require('../services/auth.service');
const tokenService = require('../services/token.service');
const config = require('../config');
const ApiError = require('../utils/ApiError');


const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const user = await authService.loginWithEmailAndPassword(email, password);
    const tokens = await tokenService.generateAuthTokens(user);

    //Gửi refreshToken qua cookie httpOnly để tăng cường bảo mật
    res.cookie('refreshToken', tokens.refreshToken.token, {
        httpOnly: true,
        secure: config.env === 'production',
        sameSite: 'None',
        maxAge: config.jwt.refreshExpirationDays * 24 * 60 * 60 * 1000, // maxAge tính bằng mili giây
    });

    // Xóa mật khẩu trước khi gửi về client
    user.password = undefined;

    // Trả về response đúng như cấu trúc FE cần
    res.status(StatusCodes.OK).send({
        success: true,
        message: 'Đăng nhập thành công',
        data: {
            user,
            accessToken: tokens.accessToken.token,
            refreshToken: tokens.refreshToken.token,
        }
    })
})

const register = catchAsync(async (req, res) => {
    const user = await authService.register(req.body);
    res.status(StatusCodes.CREATED).send({
        success: true,
        message: 'Đăng ký thành công. Vui lòng đăng nhập.',
        data: user
    })
})

const logout = catchAsync(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(refreshToken) {
        await authService.logout(refreshToken);
    }
    res.clearCookie('refreshToken');
    res.status(StatusCodes.NO_CONTENT).send();
})

const refreshToken = catchAsync(async (req, res) => {
  const oldRefreshToken = req.cookies.refreshToken;
  if (!oldRefreshToken) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Không tìm thấy refresh token');
  }

  const newTokens = await tokenService.refreshAuth(oldRefreshToken);

  res.cookie('refreshToken', newTokens.refreshToken.token, {
    httpOnly: true,
    secure: config.env === 'production',
    maxAge: config.jwt.refreshExpirationDays * 24 * 60 * 60 * 1000,
  });

  // Chỉ trả về access token mới
  res.status(StatusCodes.OK).send({
    success: true,
    data: {
      accessToken: newTokens.accessToken.token,
    },
  });
});

module.exports = {
    login,
    register,
    logout,
    refreshToken
}
