const catchAsync = require("../utils/catchAsync");
const displayService = require("../services/display.service");
const { StatusCodes } = require("http-status-codes");

// Thêm mới tác phẩm
const createPainting = catchAsync(async (req, res) => {
    await displayService.createPainting(req.body);
    res.status(StatusCodes.CREATED).send({ success: true, message: 'Thêm mới bản ghi thành công.'});
})

module.exports = {
    createPainting,
}