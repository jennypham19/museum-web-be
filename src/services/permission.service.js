const { Op, STRING } = require('sequelize');
const { Action, Menu, MenuAction, RoleGroup, RoleGroupMenu, RoleGroupAction, UserRole, sequelize } = require('../models');
const ApiError = require('../utils/ApiError');
const { StatusCodes } = require('http-status-codes');
const userService = require('../services/user.service');

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
const buildPermission = async (roleGroup, permissions) => {
    const menuMap = {};
    const actionIds = [];
    for(const item of permissions) {
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
const createRoleGroup = async ({ name, permissions }) => {
    try {
        const roleGroup = await RoleGroup.create({ name });
        await buildPermission(roleGroup, permissions);
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

// Lấy chi tiết nhóm quyền cùng với chức năng và thao tác
const getRoleGroupWithMenuAndAction = async (id) => {
    try {
        const roleGroup = await RoleGroup.findOne({
            where: { id }, 
            include: [
                {
                    model: RoleGroupMenu,
                    as: 'roleGroupMenu',
                    include: [
                        { model: Menu, as: 'menu'}
                    ]
                },
                {
                    model: RoleGroupAction,
                    as: 'roleGroupAction',
                    include: [
                        { model: MenuAction, as: 'menuAction'}
                    ]
                }
            ]
        });
        
        if(!roleGroup) throw new ApiError(StatusCodes.NOT_FOUND, 'Không tồn tại bản ghi.');
        const rg = roleGroup.toJSON(); // ép vể object thường

        const menus = rg.roleGroupMenu.map((rgm) => {
            const m = { ...rgm.menu };
            if(m.parent_code === null) m.parent_code = '';
            return m;
        });

        const actions = rg.roleGroupAction.map((rga) => rga.menuAction);

        // Gom action theo menu_id
        const actionByMenu = {};
        actions.forEach((act) => {
            if(!actionByMenu[act.menu_id]) actionByMenu[act.menu_id] = [];
            actionByMenu[act.menu_id].push(act)
        })

        // Đệ quy build menu tree
        const mapMenu = (menuList, parentCode = '') => {
            return menuList
                .filter((m) => m.parent_code === parentCode)
                .map((menu) => {
                    const node  = {
                        id: menu.id,
                        code: menu.code,
                        name: menu.name,
                        path: menu.path,
                        icon: menu.icon
                    };

                    const menuAcions = (actionByMenu[menu.id] || []).map((act) => ({
                        id: act.id,
                        code: act.code,
                        name: act.name
                    }));
                    if(menuAcions.length > 0) {
                        node.actions = menuAcions;
                    }

                    const children = mapMenu(menuList, menu.code);
                    if(children.length > 0) {
                        node.children = children;
                    };

                    return node;
                })
        };

        return {
            id: rg.id,
            name: rg.name,
            permissions: mapMenu(menus)
        };

    } catch (error) {
        if(error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Lỗi xảy ra khi lấy chi tiết bản ghi: ' + error.message);
    }
}

// Đệ quy upsert thao tác và chức năng
const upsertMenusAndActions = async (id, menu, transaction) => {
    // Menu
    await RoleGroupMenu.findOrCreate({
        where: { role_group_id: id, menu_id: menu.id },
        defaults: { role_group_id: id, menu_id: menu.id },
        transaction,
    })

    // Actions
    if(menu.actions) {
        for (const action of menu.actions) {
            await RoleGroupAction.findOrCreate({
                where: { role_group_id: id, menu_action_id: action.id },
                defaults: { role_group_id: id, menu_action_id: action.id },
                transaction,
            })
        }
    }

    // Children
    if(menu.children) {
        for(const child of menu.children){
            await upsertMenusAndActions(id, child, transaction)
        }
    }
}

// chỉnh sửa nhóm quyền kèm với menu và thao tác
const updateRoleGroupWithMenuAndAction = async(id, roleGroupBody) => {
    const transaction = await sequelize.transaction();
    try {
        const roleGroup = await RoleGroup.findByPk(id, { transaction });
        if(!roleGroup) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Nhóm quyền không tồn tại');
        }

        // cập nhật tên nhóm
        roleGroup.name = roleGroupBody.name;
        await roleGroup.save({ transaction });

        // upsert permissions
        if(roleGroupBody.permissions){
            for(const menu of roleGroupBody.permissions) {
                await upsertMenusAndActions(id, menu, transaction);
            }
        };

        await transaction.commit();

        const roleGroupFormatted = await getRoleGroupWithMenuAndAction(roleGroup.id);
        return roleGroupFormatted;
    } catch (error) {
        await transaction.rollback();
        if(error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Lỗi khi xảy ra chỉnh sửa nhóm quyền: ' + error.message);
    }
}

// Lấy ra danh sách nhóm quyền có gắn chức năng
const queryRoleGroups = async(queryOptions) => {
    try {
        const { page, limit, searchTerm } = queryOptions;
        const offset = (page - 1) * limit;
        
        const whereClause = {};
        if(searchTerm) {
            whereClause[Op.or] = [
                { name: { [Op.iLike]: `%${searchTerm}%` }},
            ]
        }
        const { count, rows: roleGroups } = await RoleGroup.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: RoleGroupMenu,
                    as: 'roleGroupMenu',
                    include: [
                        { model: Menu, as: 'menu'}
                    ]
                },
                {
                    model: RoleGroupAction,
                    as: 'roleGroupAction',
                    include: [
                        { model: MenuAction, as: 'menuAction'}
                    ]
                }
            ],
            limit,
            offset,
            order: [[ 'id', 'ASC']],
            distinct: true // chỉ tính count trong RoleGroups
        });

        const formattedRoleGroups = roleGroups.map((roleGroup) => {
            const rg = roleGroup.toJSON();
            const menus = rg.roleGroupMenu.map((rgm) => {
                const m = { ...rgm.menu };
                if(m.parent_code === null) m.parent_code = '';
                return m;
            });

            const actions = rg.roleGroupAction.map((rga) => rga.menuAction);

            // Gom action theo menu_id
            const actionByMenu = {};
            actions.forEach((act) => {
                if(!actionByMenu[act.menu_id]) actionByMenu[act.menu_id] = [];
                actionByMenu[act.menu_id].push(act)
            })

            // Đệ quy build menu tree
            const mapMenu = (menuList, parentCode = '') => {
                return menuList
                    .filter((m) => m.parent_code === parentCode)
                    .map((menu) => {
                        const node  = {
                            id: menu.id,
                            code: menu.code,
                            name: menu.name,
                            path: menu.path,
                            icon: menu.icon
                        };

                        const menuAcions = (actionByMenu[menu.id] || []).map((act) => ({
                            id: act.id,
                            code: act.code,
                            name: act.name
                        }));
                        if(menuAcions.length > 0) {
                            node.actions = menuAcions;
                        }

                        const children = mapMenu(menuList, menu.code);
                        if(children.length > 0) {
                            node.children = children;
                        };

                        return node;
                    })
            };
        
            return {
                id: rg.id,
                name: rg.name,
                permissions: mapMenu(menus)
            };
        });

        const totalPages = Math.ceil(count/limit);
        return {
            roleGroups: formattedRoleGroups,
            totalPages,
            currentPage: page,
            total: count
        }
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Có lỗi xảy ra khi lấy danh sách: ' + error.message)
    }
}

// Lấy chi tiết nhóm quyền
const getRoleGroupById = async (id) => {
    const roleGroup = await RoleGroup.findByPk(id);
    if (!roleGroup) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy nhóm quyền');
    }
    return roleGroup;
}

// Gán nhóm quyền cho user
const assignRoleGroupToUser = async(userId, roleGroupId) => {
    const user = await userService.getUserById(userId);
    const roleGroup = await getRoleGroupById(roleGroupId);
    try {
        const existingUserRole = await UserRole.findOne({ where: { user_id: userId }});
        if(existingUserRole) {
            // Nếu đã có nhóm quyền thì cập nhật
            existingUserRole.role_group_id = roleGroupId;
            await existingUserRole.save();
        }else{
            // Nếu chưa có thì tạo mới
            await UserRole.create({ user_id: userId, role_group_id: roleGroupId });
        }
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Gán ${roleGroup.name} cho ${user.fullName} thất bại: ` + error.message)
    }
}

// Map nhóm quyền theo dang tree
const mapPermissionByTree = (roleGroup) => {
    const rg = roleGroup.toJSON(); // ép vể object thường
    const menus = rg.roleGroupMenu.map((rgm) => {
            const m = { ...rgm.menu };
            if(m.parent_code === null) m.parent_code = '';
            return m;
        });

        const actions = rg.roleGroupAction.map((rga) => rga.menuAction);

        // Gom action theo menu_id
        const actionByMenu = {};
        actions.forEach((act) => {
            if(!actionByMenu[act.menu_id]) actionByMenu[act.menu_id] = [];
            actionByMenu[act.menu_id].push(act)
        })

        // Đệ quy build menu tree
        const mapMenu = (menuList, parentCode = '') => {
            return menuList
                .filter((m) => m.parent_code === parentCode)
                .map((menu) => {
                    const node  = {
                        id: menu.id,
                        code: menu.code,
                        name: menu.name,
                        path: menu.path,
                        icon: menu.icon
                    };

                    const menuAcions = (actionByMenu[menu.id] || []).map((act) => ({
                        id: act.id,
                        code: act.code,
                        name: act.name
                    }));
                    if(menuAcions.length > 0) {
                        node.actions = menuAcions;
                    }

                    const children = mapMenu(menuList, menu.code);
                    if(children.length > 0) {
                        node.children = children.sort((a, b) => a.code.localeCompare(b.code));
                    };

                    return node;
                })
                // sắp xếp cấp hiện tại theo code
                .sort((a, b) => a.code.localeCompare(b.code))
        };

        return {
            id: rg.id,
            name: rg.name,
            permissions: mapMenu(menus)
        };
}

// Lấy nhóm quyền theo id user
const getRoleGroupByUserId = async(userId) => {
    try {
        const roleGroup = await RoleGroup.findOne({
            include: [
                {
                    model: UserRole,
                    as: 'roleGroupUser',
                    where: {
                        user_id: userId
                    }
                },
                {
                    model: RoleGroupMenu,
                    as: 'roleGroupMenu',
                    include: [
                        { model: Menu, as: 'menu'}
                    ]
                },
                {
                    model: RoleGroupAction,
                    as: 'roleGroupAction',
                    include: [
                        { model: MenuAction, as: 'menuAction'}
                    ]
                }
            ]
        });
        
        if(!roleGroup) throw new ApiError(StatusCodes.NOT_FOUND, 'Không tồn tại bản ghi.');
        return mapPermissionByTree(roleGroup);

    } catch (error) {
        if(error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Lỗi xảy ra khi lấy chi tiết bản ghi: ' + error.message);
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
    getPermissions,
    getRoleGroupWithMenuAndAction,
    updateRoleGroupWithMenuAndAction,
    queryRoleGroups,
    assignRoleGroupToUser,
    getRoleGroupByUserId,
    mapPermissionByTree
}