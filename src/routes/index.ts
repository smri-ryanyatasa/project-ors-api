import { Hono } from 'hono';

import userRoute from '../modules/user/user.route';
import authRoute from '../modules/auth/auth.route';
import rolePermissionsRoute from '../modules/rolePermissions/rolePermissions.route';
import plUploadRoute from '../modules/pl-upload/plUpload.route';
import branchRoute from '../modules/branch/branch.route';

const routes = new Hono();

routes.route('/users', userRoute);
routes.route('/auth', authRoute);
routes.route('/role-permissions', rolePermissionsRoute);
routes.route('/pl-upload', plUploadRoute);
routes.route('/branch', branchRoute);

export default routes;