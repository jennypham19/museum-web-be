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
    const { page, limit, searchTerm } = queryOptions;
    try {
        const offset = (page - 1) * limit;
        const whereClause = {};
        if(searchTerm) {
            whereClause[Op.or] = [
                { name: { [Op.iLike]: `%${searchTerm}%` }},
                { author: { [Op.iLike]: `%${searchTerm}%` }},
                { period: { [Op.iLike]: `%${searchTerm}%` }}
            ]
        };

        const { count, rows: paintingsDB } = await Painting.findAndCountAll({
            where: whereClause,
            limit,
            offset,
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
            ]
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
            totalPaintings: count
        }
        
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Đã có lỗi khi lấy ra danh sách tác phẩm: ' + error.message);
    }
}


module.exports = {
    createPainting,
    queryListPaintings,
}