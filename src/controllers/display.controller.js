const catchAsync = require("../utils/catchAsync");
const displayService = require("../services/display.service");
const { StatusCodes } = require("http-status-codes");
const pick = require("../utils/pick");

// Thêm mới tác phẩm
const createPainting = catchAsync(async (req, res) => {
    await displayService.createPainting(req.body);
    res.status(StatusCodes.CREATED).send({ success: true, message: 'Thêm mới bản ghi thành công.'});
})

// Lấy ra danh sách + search tác phẩm
const getListPaintings = catchAsync(async (req, res) => {
    const queryOptions = pick(req.query, ['page', 'limit', 'searchTerm']);
    const paintings = await displayService.queryListPaintings(queryOptions);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy danh sách thành công.', data: paintings})
})

module.exports = {
    createPainting,
    getListPaintings
}