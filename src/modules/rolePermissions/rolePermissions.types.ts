export interface RolePermissions {
    id: number,
    name: string,
    description: string,
    level: number,
    default_dashboard: string,
    created_by:  number,
    created_date: string,
}

export interface Menus {
    id: number,
    parent_id: number,
    name: string,
    menu_sequence: number,
    url: string,
    icon: string,
    created_by: number,
    created_date: string,
    children?: Menus[];
}

