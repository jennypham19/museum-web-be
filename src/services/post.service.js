const { Post, Source, Image, Video, sequelize, User } = require('../models');
const { StatusCodes } = require('http-status-codes');
const ApiError = require('../utils/ApiError');
// Thêm mới bài viết bộ sưu tập
const createPostCollection = async(postBody) => {
    const transaction = await sequelize.transaction();
    const { category, date, title, summary, author, period, nameUrl, imageUrl, content, source, images, videos, authorId } = postBody;
    try {
        // 1. Tạo post
        const postCreate = await Post.create(
            { category, date, title, summary, author, period, name_url: nameUrl, image_url: imageUrl, content, status: 'pending', author_id: authorId},
            {transaction}
        )

        // 2. Nguồn
        if(source !== null) {
            await Source.create({
                post_id: postCreate.id,
                link_facebook: source.link_facebook,
                link_instagram: source.link_instagram,
                link_youtube: source.link_youtube,
                link_web: source.link_web,
            }, { transaction })
        };

        // 3.. Ảnh
        if(images && images.length > 0){
            for(const img of images) {
                await Image.create({
                    post_id: postCreate.id,
                    name: img.name,
                    url: img.url
                }, { transaction })
            }
        };

        // 4. Video
        if(videos && videos.length > 0){
            for(const vid of videos) {
                await Video.create({
                    post_id: postCreate.id,
                    name: vid.name,
                    url: vid.url
                }, { transaction })
            }
        }
        await transaction.commit();
        // 5. Trả về dữ liệu đã được thêm mới
        const newPost = await Post.findOne({
            where: { id: postCreate.id },
            include: [
                { model: Source, as: 'postSource' },
                { model: Image, as: 'postImages' },
                { model: Video, as: 'postVideos' },
                { model: User, as: 'postUser' }
            ]
        });

        const post = newPost.toJSON();
        const sourceRes = {
            id: post.postSource.id,
            linkFacebook: post.postSource.link_facebook,
            linkInstagram: post.postSource.link_instagram,
            linkYoutube: post.postSource.link_youtube,
            linkWeb: post.postSource.link_web
        }
        return {
            category: post.category,
            date: post.date,
            title: post.title,
            summary: post.summary,
            author: post.author,
            period: post.period,
            nameUrl: post.name_url,
            imageUrl: post.image_url,
            content: post.content,
            authorName: post.postUser.full_name,
            source: post.postSource !== null ? sourceRes : null,
            images: (post.postImages ?? [])
                .map((img) => {
                    return {
                        id: img.id,
                        name: img.name,
                        url: img.url
                    }
                }),
            videos: (post.postVideos ?? [])
                .map((vid) => {
                    return {
                        id: vid.id,
                        name: vid.name,
                        url: vid.url
                    }
                })
        };
    } catch (error) {
        if (!transaction.finished) {   // ✅ chỉ rollback nếu chưa commit/rollback
            await transaction.rollback();
        }
        if( error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Lỗi khi tạo bài viết: ' + error.message);
    }
}

module.exports = {
    createPostCollection,
}