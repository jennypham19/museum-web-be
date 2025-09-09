const { Op, STRING } = require('sequelize');
const { Action, Menu, MenuAction, RoleGroup, RoleGroupMenu, RoleGroupAction } = require('../models');
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
        await menuUpdate.update({
            code,
            name,
            path,
            icon,
            parent_code: parentCode,
        }, {transaction})

        if(Array.isArray(actions)){
            //Trường hợp thêm bản ghi mới
            //Tách action cũ (có id) và action mới (không có id)
            const existingActionUpdate = actions.filter(el => el.id);
            const newAction = actions.filter(el => !el.id);

            //Update action có id
            for(const act of existingActionUpdate){
                await MenuAction.update(
                {
                    code: act.code,
                    name: act.name
                },
                {
                    where: { id: act.id, menu_id: id },
                    transaction
                }
            )};

            // Update action mới không có id
            for (const act of newAction) {
                // Tìm action trong bảng Actions => lấy id
                let action = await Action.findOne({ where: { name: act.name }, transaction});
                // Tạo quan hệ Menu - Action
                await MenuAction.create({
                    menu_id: id,
                    action_id: action.id,
                    code: act.code,
                    name: act.name
                }, { transaction })
            }
        }
        await transaction.commit();
        return menuUpdate;
    } catch (error) {
        if( error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Lỗi khi chỉnh sửa chức năng: ' + error.message);
    }
}

// Lấy danh sách chức năng kèm thao tác
const getMenuWithAction = async () => {
    try {
        const menus = await Menu.findAll({
            include: [
                {
                    model: MenuAction,
                    as: 'menusAction',
                }
            ],
            order: [
                [ 'id', 'ASC' ],
                [ 'menusAction', 'id', 'ASC' ]
            ]
        });
        const modules = menus.map((menu) => ({
            ...menu.toJSON(),
            parentCode: menu.parent_code,
            menusAction: undefined,
            actions: (menu.menusAction ?? [])
                .filter((el) => el.menu_id === menu.id)
                .map((action) => {
                    return {
                        id: action.id,
                        code: action.code,
                        name: action.name
                    }
                }),
            children: [],
        }));

        // Build tree theo parent_code
        const menuMap = {};
        modules.forEach((menu) => {
            menuMap[menu.code] = menu;
        });

        const roots = [];
        modules.forEach((menu) => {
            if(menu.parent_code) {
                const parent = menuMap[menu.parent_code];
                if(parent) {
                    parent.children.push(menu);
                }
            }else {
                roots.push(menu)
            }
        })
        return roots;
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Lỗi khi lấy danh sách: ' + error.message);
    }
}

// Đệ quy hàm lưu chức năng và thao tác
const buildPermission = async (roleGroup, permission) => {
    const menuMap = {};
    const actionIds = [];
    for(const item of permission) {
        const menu = await Menu.findOne({ where: { code: item.code} });
        if(!menu) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Không tồn tại chức năng này');
        };

        menuMap[item.code] = menu.id;
        await RoleGroupMenu.create({ role_group_id: roleGroup.id, menu_id: menu.id});
        for(const action of item. actions) {
            const actionModel = await MenuAction.findOne({ where: { code: action.code} });
            if(actionModel){
                actionIds.push(actionModel.id);
                await RoleGroupAction.create({ role_group_id: roleGroup.id, menu_action_id: actionModel.id})
            }
        }

        await buildPermission(roleGroup, item.children);
    }
}

// Tạo nhóm quyền
const createRoleGroup = async ({ name, permission }) => {
    try {
        const roleGroup = await RoleGroup.create({ name });
        await buildPermission(roleGroup, permission);
        return roleGroup;
    } catch (error) {
        if(error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Lỗi khi xảy ra tạo nhóm quyền: ' + error.message);
    }
}

// Lấy ra danh sách bản ghi nhóm quyền
const getPermissions = async (queryOptions) => {
    try {
        const { page, limit, searchTerm } = queryOptions;
        const offset = (page - 1) * limit;
        
        const whereClause = {};
        if(searchTerm) {
            whereClause[Op.or] = [
                { name: { [Op.iLike]: `%${searchTerm}%` }},
            ]
        }

        const { count, rows: permissions } = await RoleGroup.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            order: [[ 'createdAt', 'ASC']]
        })

        const totalPages = Math.ceil(count/limit);
        return {
            permissions,
            totalPages,
            currentPage: page,
            total: count
        }
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Lỗi xảy ra khi lấy danh sách: ' + error.message)
    }

}

module.exports = {
    createAction,
    getActionById,
    getActions,
    updateAction,
    createMenu,
    getMenus,
    getMenuById,
    updateMenu,
    getMenuWithAction,
    createRoleGroup,
    getPermissions
}