import { Hono } from 'hono';

import { authMiddleware } from '../../common/middleware/auth.middleware';
import { RolePermissionsController } from './rolePermissions.controller';

const rolePermissionsRoute = new Hono();

const controller = new RolePermissionsController();

rolePermissionsRoute.use('*', authMiddleware);

rolePermissionsRoute.get('/', (c) => controller.getRolePermissions(c));
rolePermissionsRoute.post('/', (c) => controller.createRolePermissions(c));
rolePermissionsRoute.put('/:role_id', (c) => controller.updateRolePermissions(c));
rolePermissionsRoute.delete('/:role_id', (c) => controller.deleteRolePermissions(c));
rolePermissionsRoute.get('/menus', (c) => controller.getMenus(c));


export default rolePermissionsRoute;