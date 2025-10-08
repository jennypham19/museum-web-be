const catchAsync = require("../utils/catchAsync");
const displayService = require("../services/display.service");
const { StatusCodes } = require("http-status-codes");
const pick = require("../utils/pick");

// Thêm mới tác phẩm
const createPainting = catchAsync(async (req, res) => {
    await displayService.createPainting(req.body);
    res.status(StatusCodes.CREATED).send({ success: true, message: 'Thêm mới bản ghi thành công.'});
})

// Thêm mới bộ sưu tập
const createCollection = catchAsync(async (req, res) => {
    await displayService.createCollection(req.body);
    res.status(StatusCodes.CREATED).send({ success: true, message: 'Thêm mới bản ghi thành công.'});
})

// Chỉnh sửa bộ sưu tập
const updateCollection = catchAsync(async (req, res) => {
    await displayService.updateCollection(req.params.id, req.body);
    res.status(StatusCodes.OK).send({ success: true, message: 'Chỉnh sửa bộ sưu tập thành công.'})
})

// Lấy ra danh sách + search tác phẩm
const getListPaintings = catchAsync(async (req, res) => {
    const queryOptions = pick(req.query, ['page', 'limit', 'status', 'searchTerm']);
    const paintings = await displayService.queryListPaintings(queryOptions);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy danh sách thành công.', data: paintings})
})

// Lấy ra danh sách + search bộ sưu tập
const getListCollections = catchAsync(async (req, res) => {
    const queryOptions = pick(req.query, ['page', 'limit', 'status', 'curatorId', 'searchTerm']);
    const collections = await displayService.queryListCollections(queryOptions);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy danh sách thành công.', data: collections})
})

// Gửi phê duyệt tác phẩm
const sendApproval = catchAsync(async (req, res) => {
    await displayService.sendApproval(req.params.id, req.body);
    res.status(StatusCodes.OK).send({ success: true, message: 'Gửi phê duyệt thành công.'})
})

// Gửi phê duyệt bộ sưu tập
const sendCollectionApproval = catchAsync(async (req, res) => {
    await displayService.sendCollectionApproval(req.params.id, req.body);
    res.status(StatusCodes.OK).send({ success: true, message: 'Gửi phê duyệt thành công.'})
})

// Đăng tải
const publishPainting = catchAsync(async (req, res) => {
    const painting = await displayService.publishPainting(req.params.id, req.body);
    res.status(StatusCodes.OK).send({ success: true, message: painting.is_published ? 'Đăng tải thành công.' : 'Hủy đăng tải thành công'});
})

// Phê duyệt
const approvePainting = catchAsync(async (req, res) => {
    await displayService.approvePainting(req.params.id, req.body);
    res.status(StatusCodes.OK).send({ success: true, message: 'Duyệt tác phẩm thành công.'})
})

// Từ chối tác phẩm
const rejectPainting = catchAsync(async (req, res) => {
    await displayService.rejectPainting(req.params.id, req.body);
    res.status(StatusCodes.OK).send({ success: true, message: 'Từ chối phê duyệt tác phẩm thành công.'})
})

// Từ chối bộ sưu tập
const rejectCollection = catchAsync(async (req, res) => {
    await displayService.rejectCollection(req.params.id, req.body);
    res.status(StatusCodes.OK).send({ success: true, message: 'Từ chối phê duyệt bộ sưu tập thành công.'})
})

// Xóa tác phẩm
const deletePainting = catchAsync(async (req, res) => {
    const painting = await displayService.deletePainting(req.params.id);
    res.status(StatusCodes.OK).send({ success: true, message: 'Xóa tác phẩm thành công.', data: painting})
})

// Gỡ tác phẩm khỏi bộ sưu tập
const detachArtFromCollection = catchAsync(async (req, res) => {
    await displayService.detachArtFromCollection(req.params.collectionId, req.body.artIds);
    res.status(StatusCodes.OK).send({ success: true, message: 'Gỡ tác phẩm khỏi bộ sưu tập tập thành công.'})
})

// Gán tác phẩm khỏi bộ sưu tập
const attachArtToCollection = catchAsync(async (req, res) => {
    await displayService.attachArtToCollection(req.params.collectionId, req.body.artIds);
    res.status(StatusCodes.OK).send({ success: true, message: 'Gán tác phẩm vào bộ sưu tập tập thành công.'})
})

// Lấy chi tiết bộ sưu tập có tác phẩm bên trong
const getCollectionHasArtById = catchAsync(async (req, res) => {
    const collection = await displayService.getCollectionHasArtById(req.params.id);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy chi tiết bộ sưu tập thành công.', data: collection})
})

module.exports = {
    createPainting,
    getListPaintings,
    sendApproval,
    publishPainting,
    approvePainting,
    rejectPainting,
    deletePainting,
    createCollection,
    getListCollections,
    detachArtFromCollection,
    getCollectionHasArtById,
    attachArtToCollection,
    sendCollectionApproval,
    updateCollection,
    rejectCollection
}