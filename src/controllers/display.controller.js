const catchAsync = require("../utils/catchAsync");
const displayService = require("../services/display.service");
const { StatusCodes } = require("http-status-codes");
const pick = require("../utils/pick");
const { broadcastToAdmins } = require("../websocket")

{/* --------------------------- 1. TÁC PHẨM --------------------------- */}
// Thêm mới tác phẩm
const createPainting = catchAsync(async (req, res) => {
    await displayService.createPainting(req.body);
    res.status(StatusCodes.CREATED).send({ success: true, message: 'Thêm mới bản ghi thành công.'});
})
// Lấy ra danh sách + search tác phẩm
const getListPaintings = catchAsync(async (req, res) => {
    const queryOptions = pick(req.query, ['page', 'limit', 'status', 'searchTerm']);
    const paintings = await displayService.queryListPaintings(queryOptions);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy danh sách thành công.', data: paintings})
})
// Gửi phê duyệt bộ sưu tập
const sendCollectionApproval = catchAsync(async (req, res) => {
    await displayService.sendCollectionApproval(req.params.id, req.body);
    res.status(StatusCodes.OK).send({ success: true, message: 'Gửi phê duyệt thành công.'})
})

// Đăng tải tác phẩm
const publishPainting = catchAsync(async (req, res) => {
    const painting = await displayService.publishPainting(req.params.id, req.body);
    res.status(StatusCodes.OK).send({ success: true, message: painting.is_published ? 'Đăng tải thành công.' : 'Hủy đăng tải thành công'});
})

// Gửi phê duyệt tác phẩm
const sendApproval = catchAsync(async (req, res) => {
    await displayService.sendApproval(req.params.id, req.body);
    res.status(StatusCodes.OK).send({ success: true, message: 'Gửi phê duyệt thành công.'})
})


// Phê duyệt tác phẩm
const approvePainting = catchAsync(async (req, res) => {
    await displayService.approvePainting(req.params.id, req.body);
    res.status(StatusCodes.OK).send({ success: true, message: 'Duyệt tác phẩm thành công.'})
})

// Từ chối tác phẩm
const rejectPainting = catchAsync(async (req, res) => {
    await displayService.rejectPainting(req.params.id, req.body);
    res.status(StatusCodes.OK).send({ success: true, message: 'Từ chối phê duyệt tác phẩm thành công.'})
})

// Xóa tác phẩm
const deletePainting = catchAsync(async (req, res) => {
    const painting = await displayService.deletePainting(req.params.id);
    res.status(StatusCodes.OK).send({ success: true, message: 'Xóa tác phẩm thành công.', data: painting})
})

{/* --------------------------- 2. BỘ SƯU TẬP --------------------------- */}
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

// Lấy ra danh sách + search bộ sưu tập
const getListCollections = catchAsync(async (req, res) => {
    const queryOptions = pick(req.query, ['page', 'limit', 'status', 'curatorId', 'searchTerm']);
    const collections = await displayService.queryListCollections(queryOptions);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy danh sách thành công.', data: collections})
})

// Phê duyệt bộ sưu tập
const approveCollection = catchAsync(async (req, res) => {
    await displayService.approveCollection(req.params.id, req.body);
    res.status(StatusCodes.OK).send({ success: true, message: 'Duyệt bộ sưu tập thành công.'})
})

// Từ chối bộ sưu tập
const rejectCollection = catchAsync(async (req, res) => {
    await displayService.rejectCollection(req.params.id, req.body);
    res.status(StatusCodes.OK).send({ success: true, message: 'Từ chối phê duyệt bộ sưu tập thành công.'})
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

// Gửi yêu cầu bộ sưu tập lên admin
const sendCollectionToAdmin = catchAsync(async (req, res) => {
    const request = await displayService.sendCollectionForAdmin(req.params.id, req.body);

    // Gửi thông báo realtime cho admin
    broadcastToAdmins({
        type: "NEW_REQUEST",
        message: `Yêu cầu mới: Cần phê duyệt bộ sưu tập mới`,
        data: request
    })
    res.status(StatusCodes.OK).send({ success: true, message: 'Gửi yêu cầu lên admin thành công.'})
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
    rejectCollection,
    approveCollection,
    sendCollectionToAdmin
}