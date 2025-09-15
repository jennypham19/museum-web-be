const { Post, Source, Image, Video, sequelize } = require('../models');
const { StatusCodes } = require('http-status-codes');
const ApiError = require('../utils/ApiError');
// Thêm mới bài viết bộ sưu tập
const createPostCollection = async(postBody) => {
    console.log("postBody: ",postBody);
    const transaction = await sequelize.transaction();
    const { category, date, title, summary, author, period, nameUrl, imageUrl, content, source, images, videos, authorName } = postBody;
    try {
        // 1. Tạo post
        const post = await Post.create(
            { category, date, title, summary, author, period, name_url: nameUrl, image_url: imageUrl, content, status: 'pending'},
            {transaction}
        )
        switch (post.category) {
            // 2. Bộ sưu tập
            case 3:
                // 2.1. Nguồn
                if(source !== null) {
                    await Source.create({
                        post_id: post.id,
                        link_facebook: source.link_facebook,
                        link_instagram: source.link_instagram,
                        link_youtube: source.link_youtube,
                        link_web: source.link_web,
                    }, { transaction })
                };

                // 2.2. Ảnh
                if(images && images.length > 0){
                    for(const img of images) {
                        await Image.create({
                            post_id: post.id,
                            name: img.name,
                            url: img.url
                        }, { transaction })
                    }
                };

                // 2.3. Video
                if(videos && videos.length > 0){
                    for(const vid of videos) {
                        await Video.create({
                            post_id: post.id,
                            name: vid.name,
                            url: vid.url
                        }, { transaction })
                    }
                }
            break;
        
            default:
                break;
        }
        await transaction.commit();
        return post
    } catch (error) {
        await transaction.rollback(); // rollback nếu lỗi
        if( error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Lỗi khi tạo bài viết: ' + error.message);
    }
}

module.exports = {
    createPostCollection,
}