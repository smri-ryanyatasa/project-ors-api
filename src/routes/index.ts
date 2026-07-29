import { Hono } from 'hono';

import userRoute from '../modules/user/user.route';
import authRoute from '../modules/auth/auth.route';
import rolePermissionsRoute from '../modules/rolePermissions/rolePermissions.route';
import plUploadRoute from '../modules/pl-upload/plUpload.route';

const routes = new Hono();

routes.route('/users', userRoute);
routes.route('/auth', authRoute);
routes.route('/role-permissions', rolePermissionsRoute);
routes.route('/pl-upload', plUploadRoute);

export default routes;