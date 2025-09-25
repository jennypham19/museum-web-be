const { StatusCodes } = require("http-status-codes");
const ApiError = require("../utils/ApiError");
const { sequelize, Painting, Image, ImagePainting } = require("../models");
const { Op } = require("sequelize");

// Thêm mới tác phẩm
const createPainting = async (paintingBody) => {
    const transaction = await sequelize.transaction();
    const { name, author, imageUrl, period, description, images} = paintingBody;
    try {
        // 1. Tạo painting
        const painting = await Painting.create(
            { name, author, period, image_url: imageUrl, description },
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
module.exports = {
    createPainting,
    queryListPaintings,
    sendApproval,
    getPaintingById
}