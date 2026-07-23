import { Context } from "hono";

import { RolePermissionsService } from "./rolePermissions.service";
import { CreateRoleSchema, UpdateRoleSchema } from "./rolePermissions.schema";

export class RolePermissionsController {
    private service = new RolePermissionsService();
    
    
    async getRolePermissions(c: Context): Promise<Response> {
        const roles = await this.service.getRolePermissions();

        return c.json(roles);
    }
    
    async createRolePermissions(c: Context): Promise<Response> {
        const body = await c.req.json();
        
        const result = CreateRoleSchema.safeParse(body);

        if (!result.success) {
            return c.json(
            {
                status: 'error',
                message: 'Validation failed.',
                data: result.error.flatten(),
            },  400);
        }

        const role = await this.service.createRolePermissions(result.data);

        if (role.status === 'error') {
            return c.json({
                message: role.message,
            }, 400);
        }


        return c.json(role);
    }

    async updateRolePermissions(c: Context): Promise<Response> {
        const roleId = Number(c.req.param('role_id'));
        const body = await c.req.json();

        const result = UpdateRoleSchema.safeParse(body);

        if (!result.success) {
            return c.json(
            {
                status: 'error',
                message: 'Validation failed.',
                data: result.error.flatten(),
            }, 400);
        }

        const role = await this.service.updateRolePermissions(roleId, result.data);

        return c.json(role);
    }

    async deleteRolePermissions(c: Context): Promise<Response> {
        const roleId = Number(c.req.param('role_id'));
        
        const role = await this.service.deleteRole(roleId);

        return c.json(role);
    }
    
    async getMenus(c: Context): Promise<Response> {
        const menus = await this.service.getMenus();

        return c.json(menus);
    }
}