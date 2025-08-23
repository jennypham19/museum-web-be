const { StatusCodes } = require('http-status-codes');
const catchAsync = require('../utils/catchAsync');
const userService = require('../services/user.service.js');
const pick = require('../utils/pick');

const createUser = catchAsync(async (req, res) => {
    const user = await userService.createUser(req.body);
    res.status(StatusCodes.CREATED).send({ success: true, message: 'Tạo người dùng thành công', data: user });
})

const getAllUser = catchAsync(async (req, res) => {
    const queryOptions =  pick(req.query, ['page', 'limit', 'role', 'status', 'searchTerm']);
    const users = await userService.queryUsers(queryOptions);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy danh sách người dùng thành công', data: users})
})

const getUser = catchAsync(async (req, res) => {
    const user = await userService.getUserById(req.params.id);
    res.status(StatusCodes.OK).send({ success: true, message: "List users fetched successfully", data: user });
});

const unactiveUser = catchAsync(async (req, res) => {
    await userService.unactiveUserById(req.params.id, req.body);
    res.status(StatusCodes.OK).send({success: true, message: 'Vô hiệu hóa tài khoản thành công'});
});

const activeUser = catchAsync(async (req, res) => {
    await userService.activeUserById(req.params.id, req.body);
    res.status(StatusCodes.OK).send({success: true, message: 'Kích hoạt tài khoản thành công'});
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUser(req.params.id);
  res.status(StatusCodes.OK).send({success: true, message: 'Xóa tài khoản thành công'});
})

module.exports = {
    createUser,
    getAllUser,
    getUser,
    unactiveUser,
    activeUser,
    deleteUser
}