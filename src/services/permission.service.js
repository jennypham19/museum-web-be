const { Op } = require('sequelize');
const { Action, Menu, MenuAction } = require('../models');
const ApiError = require('../utils/ApiError');
const { StatusCodes } = require('http-status-codes');

// Lấy 1 bản gi
const getActionById = async (id) => {
    const action = await Action.findByPk(id);
    if(!action) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy bản ghi nào");
    }
    return action;
}

// Lấy ra danh sách bản ghi
const getActions = async (queryOptions) => {
    try {
        const {page, limit, searchTerm } = queryOptions;
        const offset = (page - 1) * limit;
        
        const whereClause = {};
        if(searchTerm) {
            whereClause[Op.or] = [
                { code: { [Op.iLike]: `%${searchTerm}%` }},
                { name: { [Op.iLike]: `%${searchTerm}%` }},
            ]
        }

        const { count, rows: actions } = await Action.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            order: [[ 'code', 'ASC']]
        })
        const totalPages = Math.ceil(count/limit);
        return {
            actions,
            totalPages,
            currentPage: page,
            total: count
        }
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Lỗi xảy ra khi lấy danh sách: ' + error.message)
    }

}

// Thêm mới 1 bản ghi
const createAction = async (actionBody) => {
    try {
        const { code, name } = actionBody;
        const existtingAction = await Action.findOne({ where: { code }});
        if(existtingAction) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Mã đã tồn tại, vui lòng sử dụng mã khác')
        }        
        const action = await Action.create({
            code,
            name
        });
        return action;
    } catch (error) {
        // nếu đã là ApiError (do chủ động) => ném lại y nguyên
        if(error instanceof ApiError) {
            throw error;
        }
        // ngược lại là lỗi từ hệ thống => bọc thành lỗi 500
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Lỗi khi tạo thao tác: ' + error.message)
    }
}

// Cập nhập 1 bản ghi
const updateAction = async (id,actionBody) => {
    try {
        const action = await getActionById(id);
        Object.assign(action, actionBody);
        await action.save();
        return action;
    } catch (error) {
        if(error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Lỗi khi cập nhập thao tác: ' + error.message)
    }
}

// Thêm mới chức năng
const createMenu = async(menuBody) => {
    const transaction = await Menu.sequelize.transaction();
    try {
        const { code, name, path, icon, parentCode, actions } = menuBody;
        // 1. Tạo menu
        const menu = await Menu.create(
            { code, name, path, icon, parent_code: parentCode },
            { transaction }
        )
        // 2. Kiểm tra actions        
        if(actions && actions.length > 0){
           for (const act of actions) {
            // Tìm action trong bảng Actions => lấy id
            let action = await Action.findOne({ where: { name: act.name }, transaction});
            // Tạo quan hệ Menu - Action
            await MenuAction.create({
                menu_id: menu.id,
                action_id: action.id,
                code: act.code,
                name: act.name
            }, { transaction })
           }
        }else{
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Nhóm thao tác không được để trống')
        }
        await transaction.commit();
        return menu;
    } catch (error) {
        if( error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Lỗi khi thêm mới chức năng: ' + error.message);
    }
}

// Lấy ra danh sách bản ghi chức năng
const getMenus = async (queryOptions) => {
    try {
        const {page, limit, searchTerm } = queryOptions;
        const offset = (page - 1) * limit;
        
        const whereClause = {};
        if(searchTerm) {
            whereClause[Op.or] = [
                { code: { [Op.iLike]: `%${searchTerm}%` }},
                { name: { [Op.iLike]: `%${searchTerm}%` }},
            ]
        }

        const { count, rows: menus } = await Menu.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            order: [[ 'code', 'ASC']]
        })

        const formattedMenus = menus.map(menu => {
            const newMenu = menu.toJSON();
            const data = menus.find(el => newMenu.parent_code !== null && el.code === newMenu.parent_code)
            return {
                ...newMenu,
                parentCode: newMenu.parent_code,
                parentName: data ? data.name : null
            }
        })
        const totalPages = Math.ceil(count/limit);
        return {
            menus: formattedMenus,
            totalPages,
            currentPage: page,
            total: count
        }
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Lỗi xảy ra khi lấy danh sách: ' + error.message)
    }

}

// Lấy 1 bản ghi chức năng
const getMenuById = async (id) => {
    try {
        const menu = await Menu.findOne({
            where: { id },
            include: [
                {
                    model: MenuAction,
                    as: 'menusAction'
                }
            ]
        });
        if(!menu) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy bản ghi nào");
        }
        const formattedMenu = {
            ...menu.toJSON(),
            menusAction: undefined,
            actions: (menu.menusAction ?? [])
                .filter((el) => el.menu_id === menu.id)
                .map((action) => {
                    return {
                        id: action.id,
                        code: action.code,
                        name: action.name
                    }
                })
        }

        return formattedMenu;
    } catch (error) {
        if(error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Có lỗi khi lấy ra bản ghi: " + error.message)
    }
}

// Thêm mới chức năng
const updateMenu = async(id, menuBody) => {
    const transaction = await Menu.sequelize.transaction();
    try {
        const { code, name, path, icon, parentCode, actions } = menuBody;
        const menuUpdate = await Menu.findByPk(id, {transaction});
        if(!menuUpdate) throw new ApiError(StatusCodes.NOT_FOUND, 'Không tồn tại bản ghi');
        //Trường hợp chỉ cập nhập các trường trong Menu, không thêm hay xóa trong MenuAction
        if(Array.isArray(actions)){
            await menuUpdate.update({
                code,
                name,
                path,
                icon,
                parent_code: parentCode,
            }, {transaction})
        }
        await transaction.commit();
        return menu;
    } catch (error) {
        if( error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Lỗi khi thêm mới chức năng: ' + error.message);
    }
}

module.exports = {
    createAction,
    getActionById,
    getActions,
    updateAction,
    createMenu,
    getMenus,
    getMenuById
}