const { StatusCodes } = require("http-status-codes");
const ApiError = require("../utils/ApiError");
const { sequelize, Painting, Image, ImagePainting } = require("../models");
const { Op } = require("sequelize");
const cloudinary = require("../config/cloudinary");

// Thêm mới tác phẩm
const createPainting = async (paintingBody) => {
    const transaction = await sequelize.transaction();
    const { name, author, imageUrl, period, description, images, nameImage} = paintingBody;
    try {
        // 1. Tạo painting
        const painting = await Painting.create(
            { name, author, period, image_url: imageUrl, name_image: nameImage, description },
            { transaction }
        )
        // 2. Insert ảnh vào Images
        if(images && images.length > 0){
            for(const img of images){
                const image = await Image.create({
                    name: img.name,
                    url: img.url
                }, { transaction });
                await ImagePainting.create({ painting_id: painting.id, image_id: image.id }, { transaction })
            }
        }

        await transaction.commit();
    } catch (error) {
        if (!transaction.finished) {   // ✅ chỉ rollback nếu chưa commit/rollback
            await transaction.rollback();
        }
        if(error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Có lỗi xảy khi thêm mới: " + error.message);
    }
}

// Lấy ra danh sách + search tác phẩm
const queryListPaintings = async(queryOptions) => {
    try {
        const { page, limit, status, searchTerm } = queryOptions;
        const offset = (page - 1) * limit;

        const whereClause = {};
        if(status === 'all'){
            whereClause.status = { [Op.in]: ['pending', 'reviewing', 'approved', 'rejected']}
        }else if(status !== undefined && status !== 'all') {
            if (Array.isArray(status)) {
                whereClause.status = { [Op.in]: status }
            } else {
                whereClause.status = { [Op.in]: [status] }
            }
        }
        if(searchTerm) {
            whereClause[Op.or] = [
                { name: { [Op.iLike]: `%${searchTerm}%` }},
                { author: { [Op.iLike]: `%${searchTerm}%` }},
                { period: { [Op.iLike]: `%${searchTerm}%` }}
            ]
        };

        const { count, rows: paintingsDB } = await Painting.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: ImagePainting,
                    as: 'paintingImage',
                    include: [
                        {
                            model: Image,
                            as: 'images'
                        }
                    ]
                }
            ],
            limit,
            offset,
            order: [[ 'createdAt', 'DESC']],
            distinct: true // chỉ tính count trong Paintings
        });
        const paintings = paintingsDB.map((painting) => {
            const newPainting = painting.toJSON();
            const newImage = (newPainting.paintingImage ?? [])
                    .filter((el) => el.painting_id === newPainting.id)
                    .map(image => image.images)
            return {
                id: newPainting.id,
                name: newPainting.name,
                author: newPainting.author,
                imageUrl: newPainting.image_url,
                period: newPainting.period,
                description: newPainting.description,
                status: newPainting.status,
                createdAt: newPainting.createdAt,
                updatedAt: newPainting.updatedAt,
                rejectionReason: newPainting.rejection_reason,
                isPublished: newPainting.is_published,
                images: newImage.map((img) => ({
                    id: img.id,
                    name: img.name,
                    url: img.url
                }))
            }
        })

        const totalPages = Math.ceil(count/limit);
        return {
            data: paintings,
            totalPages,
            currentPage: page,
            total: count
        }
        
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Đã có lỗi khi lấy ra danh sách tác phẩm: ' + error.message);
    }
}

// Lấy chi tiết 1 bản ghi
const getPaintingById = async (id) => {
    const painting = await Painting.findByPk(id);
    if(!painting) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy tác phẩm.')
    }
    return painting;
}

// Gửi phê duyệt
const sendApproval = async(id, paintingBody) => {
    const painting = await getPaintingById(id);
    Object.assign(painting, paintingBody);
    await painting.save();
    return painting
}
// Đăng tải
const publishPainting = async(id, paintingBody) => {
    const painting = await getPaintingById(id);
    Object.assign(painting, paintingBody);
    await painting.save();
    return painting
}

// Phê duyệt
const approvePainting = async(id, paintingBody) => {
    const { status, userIdApprove } = paintingBody;
    const painting = await getPaintingById(id);
    await painting.update({ status, user_id_approve: userIdApprove });
    
}

// Từ chối
const rejectPainting = async(id, paintingBody) => {
    const { status, userIdApprove, rejectionReason } = paintingBody;
    const painting = await getPaintingById(id);
    await painting.update({ status, user_id_approve: userIdApprove, rejection_reason: rejectionReason});
}

// Xóa tác phẩm + ảnh kèm theo
const deletePainting = async(id) => {
    const transaction = await sequelize.transaction();
    try {
        // 1. Lấy ảnh trên Paintings và Images
        const painting = await getPaintingById(id);

        // Tìm tất cả các ảnh trong bảng ImagesPainting
        const imagesPainting = await ImagePainting.findAll({ where: { painting_id: id }, transaction});

        // Lấy ids ảnh trong bảng ImagesPainting
        const imageIds = imagesPainting.map((imgs) => imgs.image_id);

        // Lấy ảnh trong bảng Images
        const images = await Image.findAll({ where: { id: imageIds }, transaction})

        // Lấy publicIds trong bảng Images
        const publicIds = images.map((imgs) => imgs.name);

        if(!painting.name_image && publicIds.length === 0){
            throw new ApiError(StatusCodes.NOT_FOUND, "Không có public_id hợp lệ để xóa")
        }
        // 2. Xoá trên Cloudinary (batch)
        if(painting.name_image){
            const result = await cloudinary.uploader.destroy(painting.name_image);
            if(result.result !== 'ok' && result.result !== "not found") {
                throw new ApiError(StatusCodes.BAD_REQUEST, `Xóa ảnh chính thất bại ${painting.name_image}`);
            }
        }
        if(publicIds.length > 0) {
            const cloudResult = await cloudinary.api.delete_resources(publicIds);
            // Kiểm tra nếu Cloudinary fail bất kỳ ảnh nào 
            const failed = Object.entries(cloudResult.deleted).filter( ([, status]) => status !== "deleted" ); 
            if (failed.length > 0) { 
                throw new Error(`Xoá Cloudinary fail với: ${failed.map(([id]) => id).join(", ")}`); 
            }
        }
        
        // 3. Xóa trong DB (Images + ImagesPainting + Paintings)
        await ImagePainting.destroy({ where: { painting_id: id }, transaction});
        await Image.destroy({ where: { id: imageIds }, transaction });
        await Painting.destroy({ where: { id }, transaction});

        // 4. Commit transaction
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        if(error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Đã có lỗi xảy ra: " + error.message)
    }
}

module.exports = {
    createPainting,
    queryListPaintings,
    sendApproval,
    getPaintingById,
    publishPainting,
    approvePainting,
    rejectPainting,
    deletePainting
}