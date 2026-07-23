import sql from 'mssql';

import { getDb  } from '../../config/database';
import type { RolePermissions, Menus } from './rolePermissions.types';
import { type CreateRoleSchemaType, type UpdateRoleSchemaType } from './rolePermissions.schema';

export class RolePermissionsRepository {
    async findAll(): Promise<RolePermissions[]> {
        const db = await getDb();

        const roles = await db.request().query(`
            SELECT
                r.id,
                r.name,
                r.description,
                r.level,
                r.default_dashboard,
                STRING_AGG(CAST(rm.menu_id AS VARCHAR(MAX)), ',') AS menu_ids
            FROM roles as r
            LEFT JOIN role_menus as rm
                ON rm.role_id = r.id
            GROUP BY
                r.id,
                r.name,
                r.description,
                r.level,
                r.default_dashboard
        `)

        return roles.recordset;
    }

    async findById(roleId: number): Promise<RolePermissions | null> {
            const db = await getDb();
    
            const result = await db
                .request()
                .input('id', sql.Int, roleId)
                .query(`
                    SELECT *
                    FROM roles
                    WHERE id = @id
                `);
    
            return result.recordset[0] ?? null;
        }
    
    async findByName(name: string): Promise<RolePermissions | null> {
        const db = await getDb();

        const result = await db
            .request()
            .input('name', sql.VarChar, name)
            .query(`
                SELECT *
                FROM roles
                WHERE name = @name
            `);

        return result.recordset[0] ?? null;
    }

    async create(payload: CreateRoleSchemaType): Promise<RolePermissions> {
        const db = await getDb();

        const result = await db
            .request()
            .input('name', sql.VarChar, payload.name)
            .input('description', sql.VarChar, payload.description)
            .input('level', sql.Int, payload.level)
            .input('default_dashboard', sql.VarChar, payload.default_dashboard)
            .input('created_by', sql.Int, payload.created_by)
            .query(`
                INSERT INTO roles (
                    name,
                    description,
                    level,
                    default_dashboard,
                    created_by
                )
                VALUES (
                    @name,
                    @description,
                    @level,
                    @default_dashboard,
                    @created_by
                )
                DECLARE @id INT = SCOPE_IDENTITY();

                SELECT
                    *
                FROM roles
                WHERE id = @id;
            `);

        return result.recordset[0];
    }

    async createMany(roleId: number, menuIds: any[]): Promise<void> {
        const db = await getDb();

        const request = db
            .request();

        const values = menuIds.map((menuId, index) => {
            request.input(`menu_id${index}`, sql.Int, menuId);

            return `(@role_id, @menu_id${index})`;
        });

        request.input('role_id', sql.Int, roleId);

        await request.query(`
            INSERT INTO role_menus (
                role_id,
                menu_id
            )
            VALUES
            ${values.join(', ')}
        `);
    }

    async update(roleId: number, payload: UpdateRoleSchemaType): Promise<RolePermissions> {
        const db = await getDb();

        const result = await db
            .request()
            .input('role_id', sql.Int, roleId)
            .input('name', sql.VarChar, payload.name)
            .input('description', sql.VarChar, payload.description)
            .input('level', sql.Int, payload.level)
            .input('default_dashboard', sql.VarChar, payload.default_dashboard)
            .query(`
                UPDATE roles
                SET
                    name = @name,
                    description = @description,
                    level = @level,
                    default_dashboard = @default_dashboard
                WHERE id = @role_id

                DECLARE @id INT = SCOPE_IDENTITY();

                SELECT
                    *
                FROM roles
                WHERE id = @role_id;
            `);

        return result.recordset[0];
    }

    async delete(roleId: number): Promise<void> {
        const db = await getDb();

        await db
            .request()
            .input('role_id', sql.Int, roleId)
            .query(`
                DELETE FROM roles
                WHERE id = @role_id
            `);
    }

    async getAllMenus(): Promise<Menus[]> {
        const db = await getDb();

        const result = await db.request().query(`
            SELECT
                id,
                parent_id,
                name,
                is_parent,
                menu_sequence,
                url,
                icon
            FROM menus
            ORDER BY menu_sequence
        `);

        const tree = this.buildMenuTree(result.recordset);

        return tree;
    }

    private buildMenuTree(menus: Menus[]): Menus[] {
        const menuMap = new Map<number, Menus>();
        const tree: Menus[] = [];

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

            if (!currentMenu) continue;

            if (menu.parent_id === null || menu.parent_id === 0) {
                tree.push(currentMenu);
            } else {
                const parentMenu = menuMap.get(menu.parent_id);

                if (parentMenu) {
                    parentMenu.children!.push(currentMenu);
                }
            }
        }

        return tree;
    }

    async deletAssignedMenus(roleId: number): Promise<void> {
        const db = await getDb();

        await db
            .request()
            .input('role_id', sql.Int, roleId)
            .query(`
                DELETE FROM role_menus
                WHERE role_id = @role_id
            `);
    }
}