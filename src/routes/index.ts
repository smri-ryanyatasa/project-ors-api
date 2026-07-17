import { Hono } from 'hono';

import userRoute from '../modules/user/user.route';
import authRoute from '../modules/auth/auth.route';

const routes = new Hono();

routes.route('/users', userRoute);
routes.route('/auth', authRoute);

export default routes;