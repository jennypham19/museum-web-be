const { Op } = require('sequelize');
const { Package } = require('../models');
const ApiError = require('../utils/ApiError');
const { StatusCodes } = require('http-status-codes');

// Lấy danh sách
const queryPackages = async (queryOptions) => {
    const { page, limit, searchTerm } = queryOptions;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if(searchTerm) {
        whereClause[Op.or] = [
            { title: { [Op.iLike]: `%${searchTerm}%` }},
            { price: { [Op.iLike]: `%${searchTerm}%` }},
            { includes: { [Op.iLike]: `%${searchTerm}%` }},
            { benefits: { [Op.iLike]: `%${searchTerm}%` }},
        ]
    }

    if (!isNaN(searchTerm)) {
        whereClause[Op.or] = [
            { members: Number(searchTerm) },
            { guests: Number(searchTerm) }
        ];
    }
    
    const { count, rows: packages } = await Package.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [[ 'id', 'ASC']]
    })

    const totalPages = Math.ceil(count/limit);
    return {
        packages,
        totalPages,
        currentPage: page,
        totalPackages: count
    }
}

// Lấy chi tiết 1 bản ghi
const getPackageById = async (packageId) => {
    const package = await Package.findByPk(packageId);
    if(!package) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy bản ghi nào");
    }
    return package;
}

// Thêm mới 1 bản ghi
const createPackage = async (packageBody) => {
    const { title, price, members, guests, includes, benefits } = packageBody;

    const package = await Package.create({
        title,
        price,
        members,
        guests,
        includes,
        benefits
    });
    return package;
}

module.exports = {
    createPackage,
    queryPackages,
    getPackageById
}