export const buildMenuTree = (menus: any) =>{
    const menuMap = new Map();
    const tree = [];
    console.log(menus)
    // Create a map and initialize children
    for (const menu of menus) {
        menuMap.set(menu.id, {
        ...menu,
        children: [],
        });
    }

    // Build hierarchy
    for (const menu of menus) {
        const currentMenu = menuMap.get(menu.id);

        if (menu.parent_id === null) {
        tree.push(currentMenu);
        } else {
        const parentMenu = menuMap.get(menu.parent_id);

        if (parentMenu) {
            parentMenu.children.push(currentMenu);
        }
        }
    }

    return tree;
}