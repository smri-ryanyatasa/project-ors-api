import { RolePermissionsRepository } from "./rolePermissions.repository";
import type { CreateRoleSchemaType, UpdateRoleSchemaType } from "./rolePermissions.schema";

export class RolePermissionsService {
    private repository = new RolePermissionsRepository();

    async getRolePermissions() {
        const roles = this.repository.findAll();

        return roles;
    }

    async createRolePermissions(payload: CreateRoleSchemaType) {
        const existing = await this.repository.findByName(payload.name);

        if (existing) {
            return {
                status: 'error',
                message: 'Role already exists.',
            }
        }

        try {
            const roles = await this.repository.create({
                ...payload,
            });

            if (payload.menu_ids?.length > 0) {
                await this.repository.createMany(roles.id, payload.menu_ids)
            }

            return {
                status: 'success',
                data: roles
            }
        } catch(error) {
            return {
                status: 'error',
                message: 'Something went wrong.',
            }
        }

       
    }

    async updateRolePermissions(roleId: number, payload: UpdateRoleSchemaType) {
        const existing = await this.repository.findById(roleId);

        if (!existing) {
            return {
                status: 'error',
                message: 'Role not found.',
            }
        }

        try {
            const role = await this.repository.update(roleId, payload);

            await this.repository.deletAssignedMenus(roleId);

            if (payload.menu_ids?.length > 0) {
                await this.repository.createMany(roleId, payload.menu_ids)
            }

            return {
                status: 'success',
                data: role
            }
        } catch(error) {
            return {
                status: 'error',
                message: 'Something went wrong.',
            }
        }
    }

    async deleteRole(roleId: number) {
        const existing = await this.repository.findById(roleId);

        if (!existing) {
            return {
                message: 'Role not found.',
            }
        }

        const role = await this.repository.delete(roleId);

        return {
            status: 'success',
            message: 'Role successfully deleted.',
        }
    }

    async getMenus() {
        const menus = this.repository.getAllMenus();

        return menus;
    }
}